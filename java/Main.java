package main;

import at.ac.uibk.dbis.textfeatures.features.ErrorFeatures;
import at.ac.uibk.dbis.textfeatures.features.LexicalFeatures;
import at.ac.uibk.dbis.textfeatures.features.SyntacticalFeatures;
import at.ac.uibk.dbis.textfeatures.utilities.TextContainer;
import org.json.simple.JSONObject;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

public class Main {

    static String readFile(String path, Charset encoding) throws IOException {
        byte[] encoded = Files.readAllBytes(Paths.get(path));
        return new String(encoded, encoding);
    }

    /*
    Usage:
    java -jar TextFeatures.jar "first argument is the text" "second argument is a list of features" "third (optional) argument is to set a maximum for the n-grams"
    */
    public static void main(String[] args) throws IOException{

        int defMaxNGram = 4;

        int index = args[0].lastIndexOf("/");
        String filesLocation = args[0].substring(0,index) + "/";
        String newFileName = args[0].substring(index + 1).replace(".txt", "").replace("text_", "textresult_");

        //String text = readFile(args[0], Charset.defaultCharset());
        String text = readFile(args[0], StandardCharsets.UTF_8);
        //System.out.println(text);
        //System.out.println(Charset.defaultCharset());
        //System.out.println(readFile(args[0], StandardCharsets.UTF_8));
        File file = new File(args[0]);

        file.delete();
        Set<String> features = new HashSet<>(Arrays.asList(Arrays.copyOfRange(args, 2, args.length)));

        // the second argument sets either the maximum N for the n-grams or only some specific N
        String nGgram = args[1];
        if(nGgram.contains("n_max=")){
            defMaxNGram = Integer.valueOf(nGgram.replaceAll("n_max=", ""));
        }
        if(nGgram.contains("n_exact=")){
            int[] n_nGramsArr;
            String[] n_nGramsStr = nGgram.replaceAll("n_exact=", "").split("\\.");
            n_nGramsArr = new int[n_nGramsStr.length];
            for(int i=0; i<n_nGramsStr.length; i++){
                n_nGramsArr[i] = Integer.valueOf(n_nGramsStr[i]);
            }
            Set<String> toremove = new HashSet<>();
            Set<String> newfeatures = new HashSet<>();
            for(String s: features){
                if(s.contains("wordNGrams")){
                    toremove.add("wordNGrams");
                    for(Integer i: n_nGramsArr){
                        newfeatures.add( "wordNGrams" + i);
                    }
                }
                if(s.contains("charsNGrams")){
                    toremove.add("charsNGrams");
                    for(Integer i: n_nGramsArr){
                        newfeatures.add( "charsNGrams" + i);
                    }
                }
                if(s.contains("nGramOfTags")){
                    toremove.add("nGramOfTags");
                    for(Integer i: n_nGramsArr){
                        newfeatures.add( "nGramOfTags" + i);
                    }
                }
            }
            features.addAll(newfeatures);
            features.removeAll(toremove);
        }

        text = text.replaceAll("(?m)^\\s+", "\\$par\\$").replace("\n", " ").replace("\r", "");

        String[] strArr = text.split("\\$par\\$");      //  split the string

        if (features.contains("all")) {
            features.remove("all");
            features.addAll(getLexical());
            features.addAll(getSyntacticall());
            features.addAll(getError());
        }
        if (features.contains("allLexical")) {
            features.remove("allLexical");
            features.addAll(getLexical());
        }
        if (features.contains("allSyntactical")) {
            features.remove("allSyntactical");
            features.addAll(getSyntacticall());
        }
        if (features.contains("allError")) {
            features.remove("allError");
            features.addAll(getError());
        }

        System.out.println(features);

        int size = strArr.length;

        int par = 0;
        ArrayList<Map> resultMapArr = new ArrayList<>();
        for (String str : strArr) {
            Map<String, Object> resultMap = new HashMap<>();

            TextContainer tc = new TextContainer(str, false);
            LexicalFeatures lf = new LexicalFeatures(tc);
            SyntacticalFeatures sf = new SyntacticalFeatures(tc);
            ErrorFeatures ef = new ErrorFeatures(tc, true);
            //  see if there are features who need the calculateErrors method first.
            outer:
            for (String error : getError()) {
                for (String feature : features) {
                    if (error.equals(feature)) {
                        ef.calculateErrors();
                        break outer;
                    }
                }
            }

            for (String feature : features) {
                try {
                    switch (feature) {
                        //  Lexical Features
                        case "avgSyllablesPerSentence":
                            double avgSyllablesPerSentence = lf.avgSyllablesPerSentence();
                            resultMap.put("avgSyllablesPerSentence", avgSyllablesPerSentence);
                            break;
                        case "avgWordFrequencyClass":
                            double avgWordFrequencyClass = lf.avgWordFrequencyClass();
                            resultMap.put("avgWordFrequencyClass", avgWordFrequencyClass);
                            break;
                        case "avgWordLength":
                            double avgWordLength = lf.avgWordLength();
                            resultMap.put("avgWordLength", avgWordLength);
                            break;
                        case "avgWordsPerSentence":
                            double avgWordsPerSentence = lf.avgWordsPerSentence();
                            resultMap.put("avgWordsPerSentence", avgWordsPerSentence);
                            break;
                        case "charsNGrams":
                            for(int n=2; n<=defMaxNGram; n++) {
                                Map<ArrayList<String>, Double> charsNGramsList = lf.charsNGrams(true, n);         //maybe do more than just 2-gramm
                                Map<String, Double> charsNGrams = new HashMap<>();
                                for (Map.Entry<ArrayList<String>, Double> entry : charsNGramsList.entrySet()) {
                                    String entryString = String.join("", entry.getKey());
                                    charsNGrams.put(entryString, entry.getValue());
                                }
                                resultMap.put("charsNGrams" + n, charsNGrams);
                            }
                            break;
                        case "compressionRate":
                            double compressionRate = lf.compressionRate();
                            resultMap.put("compressionRate", compressionRate);
                            break;
                        case "compressionTime":
                            double compressionTime = lf.compressionTime(10);
                            resultMap.put("compressionTime", compressionTime);
                            break;
                        case "daleChallIndex":
                            double daleChallIndex = lf.daleChallIndex();
                            resultMap.put("daleChallIndex", daleChallIndex);
                            break;
                        case "fleschKincaidGrade":
                            double fleschKincaidGrade = lf.fleschKincaidGrade();
                            resultMap.put("fleschKincaidGrade", fleschKincaidGrade);
                            break;
                        case "frequencyOfChars":
                            Map<String, Double> frequencyOfChars = lf.frequencyOfChars(true, true);
                            resultMap.put("frequencyOfChars", frequencyOfChars);
                            break;
                        case "frequencyOfSpecialChars":
                            Map<String, Double> frequencyOfSpecialChars = lf.frequencyOfSpecialChars(true);
                            resultMap.put("frequencyOfSpecialChars", frequencyOfSpecialChars);
                            break;
                        case "frequencyOfWords":
                            Map<String, Double> frequencyOfWords = lf.frequencyOfWords(true);
                            resultMap.put("frequencyOfWords", frequencyOfWords);
                            break;
                        case "gunningFogIndex":
                            double gunningFogIndex = lf.gunningFogIndex();
                            resultMap.put("gunningFogIndex", gunningFogIndex);
                            break;
                        case "honoreMeasure":
                            double honoreMeasure = lf.honoreMeasure();
                            resultMap.put("honoreMeasure", honoreMeasure);
                            break;
                        case "indexOfDiversity":
                            double indexOfDiversity = lf.indexOfDiversity();
                            resultMap.put("indexOfDiversity", indexOfDiversity);
                            break;
                        case "numberOfHapaxDislegomena":
                            double numberOfHapaxDislegomena = lf.numberOfHapaxDislegomena();
                            resultMap.put("numberOfHapaxDislegomena", numberOfHapaxDislegomena);
                            break;
                        case "numberOfHapaxLegomena":
                            double numberOfHapaxLegomena = lf.numberOfHapaxLegomena();
                            resultMap.put("numberOfHapaxLegomena", numberOfHapaxLegomena);
                            break;
                        case "sichelMeasure":
                            double sichelMeasure = lf.sichelMeasure();
                            resultMap.put("sichelMeasure", sichelMeasure);
                            break;
                        case "typeTokenRatio":
                            double typeTokenRatio = lf.typeTokenRatio();
                            resultMap.put("typeTokenRatio", typeTokenRatio);
                            break;
                        case "wordNGrams":
                            for(int n=2; n<=defMaxNGram; n++) {
                                Map<ArrayList<String>, Double> wordNGramsList = lf.wordNGrams(true, n);         //maybe do more than just 2-gramm
                                Map<String, Double> wordNGrams = new HashMap<>();
                                for (Map.Entry<ArrayList<String>, Double> entry : wordNGramsList.entrySet()) {
                                    String entryString = String.join(" ", entry.getKey());
                                    wordNGrams.put(entryString, entry.getValue());
                                }
                                resultMap.put("wordNGrams" + n, wordNGrams);
                            }
                            break;
                        case "yuleKMeasure":
                            double yuleKMeasure = lf.yuleKMeasure();
                            resultMap.put("yuleKMeasure", yuleKMeasure);
                            break;

                        //  Syntactical Features
                        case "avgFunctionWordsPerSentence":
                            double avgFunctionWordsPerSentence = sf.avgFunctionWordsPerSentence();
                            resultMap.put("avgFunctionWordsPerSentence", avgFunctionWordsPerSentence);
                            break;
                        case "frequencyOfFuntionWords":
                            Map<String, Double> frequencyOfFuntionWords = sf.frequencyOfFuntionWords(true);
                            resultMap.put("frequencyOfFuntionWords", frequencyOfFuntionWords);
                            break;
                        case "frequencyOfTags":
                            Map<String, Double> frequencyOfTags = sf.frequencyOfTags(true);
                            resultMap.put("frequencyOfTags", frequencyOfTags);
                            break;
                        case "nGramOfTags":
                            for(int n=2; n<=defMaxNGram; n++) {
                                Map<ArrayList<String>, Double> nGramOfTagsList = sf.nGramOfTags(n, true);         //maybe do more than just 2-gramm
                                Map<String, Double> nGramOfTags = new HashMap<>();
                                for (Map.Entry<ArrayList<String>, Double> entry : nGramOfTagsList.entrySet()) {
                                    String entryString = String.join(" ", entry.getKey());
                                    nGramOfTags.put(entryString, entry.getValue());
                                }
                                resultMap.put("nGramOfTags" + n, nGramOfTags);
                            }
                            break;
                        case "punctuationWordRatio":
                            double punctuationWordRatio = sf.punctuationWordRatio();
                            resultMap.put("punctuationWordRatio", punctuationWordRatio);
                            break;

                        //  Error Features
                        case "getAvsAnRule":
                            double getAvsAnRule = ef.getAvsAnRule(true);
                            resultMap.put("getAvsAnRule", getAvsAnRule);
                            break;
                        case "getCommaWhitespaceRule":
                            double getCommaWhitespaceRule = ef.getCommaWhitespaceRule(true);
                            resultMap.put("getCommaWhitespaceRule", getCommaWhitespaceRule);
                            break;
                        case "getCompoundRule":
                            double getCompoundRule = ef.getCompoundRule(true);
                            resultMap.put("getCompoundRule", getCompoundRule);
                            break;
                        case "getContractionSpellingRule":
                            double getContractionSpellingRule = ef.getContractionSpellingRule(true);
                            resultMap.put("getContractionSpellingRule", getContractionSpellingRule);
                            break;
                        case "getDoublePunctuationRule":
                            double getDoublePunctuationRule = ef.getDoublePunctuationRule(true);
                            resultMap.put("getDoublePunctuationRule", getDoublePunctuationRule);
                            break;
                        case "getEnglishUnpairedBracketsRule":
                            double getEnglishUnpairedBracketsRule = ef.getEnglishUnpairedBracketsRule(true);
                            resultMap.put("getEnglishUnpairedBracketsRule", getEnglishUnpairedBracketsRule);
                            break;
                        case "getEnglishWordRepeatBeginningRule":
                            double getEnglishWordRepeatBeginningRule = ef.getEnglishWordRepeatBeginningRule(true);
                            resultMap.put("getEnglishWordRepeatBeginningRule", getEnglishWordRepeatBeginningRule);
                            break;
                        case "getEnglishWordRepeatRule":
                            double getEnglishWordRepeatRule = ef.getEnglishWordRepeatRule(true);
                            resultMap.put("getEnglishWordRepeatRule", getEnglishWordRepeatRule);
                            break;
                        //case "getFrequencyOfRules":       //does all error rules
                        //   break;
                        //case "getFrequencyOfSuggestions":
                        //    break;
                        case "getMorfologikAmericanSpellerRules":
                            double getMorfologikAmericanSpellerRules = ef.getMorfologikAmericanSpellerRules(true);
                            resultMap.put("getMorfologikAmericanSpellerRules", getMorfologikAmericanSpellerRules);
                            break;
                        case "getMultipleWhitespaceRule":
                            double getMultipleWhitespaceRule = ef.getMultipleWhitespaceRule(true);
                            resultMap.put("getMultipleWhitespaceRule", getMultipleWhitespaceRule);
                            break;
                        case "getSentenceWhitespaceRule":
                            double getSentenceWhitespaceRule = ef.getSentenceWhitespaceRule(true);
                            resultMap.put("getSentenceWhitespaceRule", getSentenceWhitespaceRule);
                            break;
                        case "getUppercaseSentenceStartRule":
                            double getUppercaseSentenceStartRule = ef.getUppercaseSentenceStartRule(true);
                            resultMap.put("getUppercaseSentenceStartRule", getUppercaseSentenceStartRule);
                            break;

                        default:
                            if(feature.matches("charsNGrams[0-9]+")){
                                int n = Integer.valueOf(feature.replaceAll("charsNGrams", ""));
                                Map<ArrayList<String>, Double> charsNGramsListN = lf.charsNGrams(true, n);         //maybe do more than just 2-gramm
                                Map<String, Double> charsNGramsN = new HashMap<>();
                                for(Map.Entry<ArrayList<String>, Double> entry: charsNGramsListN.entrySet()){
                                    String entryStringN = String.join("", entry.getKey());
                                    charsNGramsN.put(entryStringN, entry.getValue());
                                }
                                resultMap.put("charsNGrams" + n, charsNGramsN);


                            } else if (feature.matches("wordNGrams[0-9]+")) {
                                int n = Integer.valueOf(feature.replaceAll("wordNGrams", ""));
                                Map<ArrayList<String>, Double> wordNGramsListN = lf.wordNGrams(true, n);         //maybe do more than just 2-gramm
                                Map<String, Double> wordNGramsN = new HashMap<>();
                                for(Map.Entry<ArrayList<String>, Double> entry: wordNGramsListN.entrySet()){
                                    String entryStringN = String.join(" ", entry.getKey());
                                    wordNGramsN.put(entryStringN, entry.getValue());
                                }
                                resultMap.put("wordNGrams" + n, wordNGramsN);

                            } else if (feature.matches("nGramOfTags[0-9]+")) {
                                int n = Integer.valueOf(feature.replaceAll("nGramOfTags", ""));
                                Map<ArrayList<String>, Double> nGramOfTagsListN = sf.nGramOfTags(n, true);         //maybe do more than just 2-gramm
                                Map<String, Double> nGramOfTagsN = new HashMap<>();
                                for(Map.Entry<ArrayList<String>, Double> entry: nGramOfTagsListN.entrySet()){
                                    String entryStringN = String.join(" ", entry.getKey());
                                    nGramOfTagsN.put(entryStringN, entry.getValue());
                                }
                                resultMap.put("nGramOfTags" + n, nGramOfTagsN);
                            } else{
                                System.err.println("Unknown Feature " + feature);
                            }
                            break;
                    }
                } catch (Exception e) {
                    if (e.getMessage().contains("Divide by 0 Error / time was too short to be measured")) {
                        resultMap.put("compressionTime", 0.0);
                    } else if (e.getMessage().contains("too short")) {
                        System.out.println("paragraph " + par + " is too short");
                        //e.printStackTrace();
                    } else {
                        e.printStackTrace();
                    }
                }
            }
            par++;
            resultMapArr.add(resultMap);
            System.out.println((double)par/size);
        }
        //System.out.println(resultMapArr);

        Map<String, Object> finalMap = new HashMap<>();
        for (Object key : resultMapArr.get(0).keySet()) {   // go over all existing keys
            if (key.equals("frequencyOfChars") || key.equals("frequencyOfSpecialChars") || key.equals("frequencyOfWords")
                    || key.toString().contains("charsNGrams") || key.toString().contains("wordNGrams")
                    || key.equals("frequencyOfFuntionWords") || key.equals("frequencyOfTags") || key.toString().contains("nGramOfTags")) {
                //for features returning maps of key string and value char (keys of type ArrayList<String> have been transformed into single string)
                Map<String, ArrayList<Double>> freqMap = new HashMap<>();
                for (Map map : resultMapArr) {                                      //  search for every possible key and add a new arrayList
                    Map<String, Double> freqMapPar = (Map) map.get(key);
                    for (Map.Entry<String, Double> entry : freqMapPar.entrySet()) {
                        if (!freqMap.containsKey(entry.getKey())) {
                            freqMap.put(entry.getKey(), new ArrayList<Double>());
                        }
                    }
                }
                for (Map map : resultMapArr) {                                         //only here do i put in the values
                    Map<String, Double> freqMapPar = (Map) map.get(key);
                    for (String freqKey : freqMap.keySet()) {
                        if (freqMapPar.containsKey(freqKey)) {
                            freqMap.get(freqKey).add(freqMapPar.get(freqKey));
                        } else {
                            freqMap.get(freqKey).add(0.0);
                        }
                    }
                }
                finalMap.put(key.toString(), freqMap);
                //System.out.println(freqMap);

            } else {    // for features returning a single double value
                ArrayList<Object> values = new ArrayList<>();
                for (Map map : resultMapArr) {
                    values.add(map.get(key));
                }
                finalMap.put(key.toString(), values);
            }
        }
        JSONObject jo = new JSONObject(finalMap);
        //System.out.println(jo);

        if(jo.entrySet().size()==0){
            jo = new JSONObject();
            jo.put("no features were computed", "you probably didn't select any");
        }

        OutputStreamWriter fileWriter = new OutputStreamWriter(new FileOutputStream(filesLocation + newFileName + ".json"), StandardCharsets.UTF_8);
        fileWriter.write(jo.toJSONString());
        fileWriter.close();
        System.out.println("java is done");
    }

    private static Set<String> getLexical() {
        String[] arr = new String[]
                {"avgSyllablesPerSentence", "avgWordFrequencyClass", "avgWordLength", "avgWordsPerSentence",
                        "charsNGrams", "compressionRate", "compressionTime", "daleChallIndex",
                        "fleschKincaidGrade", "frequencyOfChars", "frequencyOfSpecialChars", "frequencyOfWords",
                        "gunningFogIndex", "honoreMeasure", "indexOfDiversity", "numberOfHapaxDislegomena",
                        "numberOfHapaxLegomena", "sichelMeasure", "typeTokenRatio", "wordNGrams", "yuleKMeasure"
                };
        return new HashSet<>(Arrays.asList(arr));
    }

    private static Set<String>  getSyntacticall() {
        String[] arr = new String[]{"avgFunctionWordsPerSentence", "frequencyOfFuntionWords", "frequencyOfTags",
                "nGramOfTags", "punctuationWordRatio"};
        return new HashSet<>(Arrays.asList(arr));

    }

    private static Set<String>  getError() {
        String[] arr = new String[]
                {"getAvsAnRule", "getCommaWhitespaceRule", "getCompoundRule", "getContractionSpellingRule",
                        "getDoublePunctuationRule", "getEnglishUnpairedBracketsRule", "getEnglishWordRepeatBeginningRule",
                        "getEnglishWordRepeatRule", "getMorfologikAmericanSpellerRules", "getMultipleWhitespaceRule",
                        "getSentenceWhitespaceRule", "getUppercaseSentenceStartRule"
                };
        return new HashSet<>(Arrays.asList(arr));

    }

}
 