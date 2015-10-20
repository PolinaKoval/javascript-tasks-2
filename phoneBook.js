'use strict';

  // var email = "just7@yandex-team.ru"
  // console.log(isValidEmail(email), email);

var phoneBook = [];
var add = function add(name, phone, email) {
    var validPhone = isValidPhone(phone);
    var validEmail = isValidEmail(email);
    if (validEmail && validPhone) {
        phoneBook.push([name, phone, email]);
        return true;
    }
    return false;
};
module.exports.add = add;

function isValidPhone(phone) {
    phone = phone.replace(/[ -]/gi,'');
    var phoneReExp = /^[\+]?(\d+\(\d{3}\))?\d{7,15}$/;
    if (phoneReExp.test(phone) && phone.length > 7) {
        //console.log('validP', phone);
        return true;
    }
    return false;
}

function isValidEmail(email) {
    var emailReExp = /^[\w-]+@([\w-]|[а-яё])+(\.([\w]|[а-яё]){2,4})+$/i;
    if (emailReExp.test(email)) {
        //console.log('validE', email);
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
    if (!matches.length) {
        console.log('no matches found');
        return;
    }
    console.log('found contacts:');
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
    if (!matches.length) {
        console.log('no matches found');
        return;
    }
    if (matches.length == 1) {
        console.log('1 contact removed');
        return;
    }
    console.log(matches.length + 'contacts removed');
};

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8');
    var parseData = data.split(/\r\n|\r|\n|;/g);
    var addedContacts = 0;
    for (var i = 0; i < parseData.length - 3; i += 3) {
        if (add(parseData[i], parseData[i + 1], parseData[i + 2])) {
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
