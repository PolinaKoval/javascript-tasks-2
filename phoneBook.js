'use strict';

var phoneBook = [];
module.exports.add = function add(name, phone, email) {
    //console.log(name , phone, email);
    var validPhone = isValidPhone(phone);
    var validEmail = isValidEmail(email);
    if (validEmail & validPhone) {
        phoneBook.push([name, phone, email]);
        return true;
    }
    return false;
};

function isValidPhone(phone) {
    var phoneReExp = /^[\+]{0,1}[\d]+\ (\(\d\d\d\)){0,1}[\d\ -]{4,15}\d$/;
    var phoneReExp2 = /^\d{10,13}/;
    var result = phone.match(phoneReExp);
    var result2 = phone.match(phoneReExp2);
    if (result || result2) {
        //console.log('validP');
        return true;
    }
    return false;
}

function isValidEmail(email) {
    var emailReExp = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    var result = email.match(emailReExp);
    if (result) {
        // console.log('validE');
        return true;
    }
    return false;
}
/*
   Функция поиска записи в телефонную книгу.
   Поиск ведется по всем полям.
*/
module.exports.find = function find(query) {
    var matches = find1(query);
    if (matches.length > 0) {
        console.log('found contacts:');
    } else {
        console.log('no matches found');
    }
    for (var i = 0; i < matches.length; i++) {
        console.log(phoneBook[matches[i]].join(', '));
    };
};


function find1(query) {
    var findRegExp = new RegExp(query);
    var matches = [];
    for (var i = 0; i < phoneBook.length; i++) {
        for (var j = 0; j < phoneBook[i].length; j++) {
            if (findRegExp.test(phoneBook[i][j])) {
                matches.push(i);
            }
        }
    }
    return matches;
}

module.exports.remove = function remove(query) {
    var matches = find1(query);
    for (var i = 0; i < matches.length; i++) {
        phoneBook.splice(matches[i], 1);
    };
    if (matches.length > 0) {
        if (matches.length == 1) {
            console.log('1 contact removed');
        } else {
            console.log(matches.length + 'contacts removed');
        }
    } else {
        console.log('no matches found');
    }
};

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
module.exports.importFmCsvro = function importFmCsvro(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    var parseData = data.split(/[;\n]/);
    var addedContacts = 0;
    for (var i = 0; i < parseData.length - 3; i += 3) {
        if (module.exports.add(parseData[i], parseData[i + 1], parseData[i + 2])) {
            addedContacts += 1;
        }
    };
    console.log(addedContacts + ' contacts added from ' + filename);
};

/*
   Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
*/
module.exports.showTable = function showTable() {
    var longestName = 0;
    var longestPhone = 0;
    var longestEmail = 0;
    for (var i = 0; i < phoneBook.length; i++) {
        if (phoneBook[i][0].length > longestName) {
            longestName = phoneBook[i][0].length;
        }
        if (phoneBook[i][1].length > longestPhone) {
            longestPhone = phoneBook[i][1].length;
        }
        if (phoneBook[i][2].length > longestEmail) {
            longestEmail = phoneBook[i][2].length;
        }
    };
    var longestLengthArray = [longestName, longestPhone, longestEmail];
    var theadArray = ['Name', 'Phone', 'Email'];
    var head = '┌';
    var bottom = '└';
    var line = '├';
    var thead = '|';
    for (var j = 0; j < 3; j++) {
        thead += ' ';
        thead += theadArray[j];
        var n = longestLengthArray[j] - theadArray[j].length + 1;
        for (var z = 0; z < n; z++) {
            thead += ' ';
        };
        for (var i = 0; i < longestLengthArray[j] + 2; i++) {
            head += '─';
            bottom += '─';
            line += '─';
        };
        if (j < 2) {
            head += '┬';
            bottom += '┴';
            line += '┼';
            thead += '|';
        } else {
            head += '┐';
            bottom += '┘';
            line += '┤';
            thead += '|';
        }
    }
    var table = '';
    for (var i = 0; i < phoneBook.length; i++) {
        for (var j = 0; j < 3; j++) {
            table += '| ';
            table += phoneBook[i][j];
            var n = longestLengthArray[j] - phoneBook[i][j].length + 1;
            for (var k = 0; k < n; k++) {
                table += ' ';
            }
        }
        table += '|';
        if (i < phoneBook.length - 1) {
            table += '\n';
        }
    };
    console.log(head);
    console.log(thead);
    console.log(line);
    console.log(table);
    console.log(bottom);
};
