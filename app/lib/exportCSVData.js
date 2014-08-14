exports.exportCsvData = function(input, fileName){
    try{
        var existingText;
        var rowTxt = "";
        var l = input.length;

        for(var i=0;i < l; i++){ // row iteration
            var members = Object.getOwnPropertyNames(input[i]); // get the properties

            for(var j = 0; j < members.length; j++){ // column iteration
                rowTxt += '"' + JSON.stringify(input[i][members[j]]) + '"';
      
                if(j < (members.length-1))
                {
                    rowTxt += ',';
                }
            }
            rowTxt += '\n';// adding new line at end of row
        }
     
        // creating output file in application data directory
        var outputFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, fileName);//'transactions.csv');
     
        if(outputFile.exists()){
            existingText = outputFile.read().toString();
            existingText = existingText.concat(rowTxt);
            outputFile.write(existingText);
            CloudClock.log("Info", "CSV generated!!!");
        }else{
            // writing data in output file 
            outputFile.write(rowTxt);
        }
         
        // return output file path
        return outputFile.nativePath;
    }
    catch(error){
       CloudClock.error(error);
    }
};