exports.exportCsvData = function(input, fileName) {
    try {
        var existingText;
        var rowTxt = "";
        var l = input.length;
        for (var i = 0; l > i; i++) {
            var members = Object.getOwnPropertyNames(input[i]);
            for (var j = 0; members.length > j; j++) {
                rowTxt += '"' + JSON.stringify(input[i][members[j]]) + '"';
                members.length - 1 > j && (rowTxt += ",");
            }
            rowTxt += "\n";
        }
        var outputFile = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, fileName);
        if (outputFile.exists()) {
            existingText = outputFile.read().toString();
            existingText = existingText.concat(rowTxt);
            outputFile.write(existingText);
            CloudClock.log("Info", "CSV generated!!!");
        } else outputFile.write(rowTxt);
        return outputFile.nativePath;
    } catch (error) {
        CloudClock.error(error);
    }
};