//Tests
//A test is defined by a object inside the tests object. The key of the object is the name of the key it will test.
//for example: the input is:
//  {
//      "email": "testmail@test.de"
//  }
//
//the corresponding test would be:
//  {
//      email: {
//          regex: some regexex test
//      }    
//  }
//
//The Test object supports multiple keys:
//  regex <regex> <required>
//      The regex object is used with the test function
//
//  allow_whitespaces <bool> <optional<default:true>>
//      If this is false and the string includes whitespaces the test will fail
//
//  aliases <list> <optional<default:empty>>
//      If there are strings in this list the same test can be used for multiple keys
//
// allow_null <bool> <optional<default:true>>
//      If this is false and the value is null the test will fail

const TESTS = {
    email: {
        regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        allow_whitespaces: false
    },
    password: {
        regex: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*!@$%&?/~_=|#^]).{8,32}$/,
        aliases: ['second_password'],
        allow_whitespaces: false,
        allow_null: false
    },
    key : {
        regex: /^[0-9A-Za-z]{8}$/,
        allow_whitespaces: false,
        allow_null: false
    },
    refresh_token: {
        regex: /^[\w-]*\.[\w-]*\.[\w-]*$/
    },
    controller_name: {
        regex: /^[0-9a-zA-Z*!@$%&?/~_=|#^]$/
    },
    cycle_time: {
        regex: /^[0-9]+$/,
        aliases:[
            "pump_time"
        ]
    },
    id: {
        regex: /^[0-9]+$/,
        aliases: [
            "controller_id",
            "plant_id"
        ]
    },
    sensor_pin: {
        regex: /^[0-9]+$/,
        aliases: [
            "pump_pin"
        ]
    },
    trigger_percentage: {
        regex: /^[0-9]+$/,
    },
    sensor_type: {
        regex: /analog|digital/
    },
    name: {
        regex: /[a-zA-z0-9 ]+/
    },
    expires_at: {
        regex: /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/,
        allow_null: true
    },
    log_action: {
        regex: /moisture_level|pump_action|system_boot|api_key_change|update|error/
    },
    int_data: {
        regex: /^[0-9]+$/
    }
}

//middle ware
//automaticaly interupts request if input is not in the 
var checkInput = (req, res, next) => {
    var data_list = createDatalist(req.body)
    var test_list = createTestlist(TESTS);

    var keys = Object.keys(data_list);
    for(var i = 0; i < keys.length; i++){
        var key = keys[i];

        //test if test for key exists
        if(test_list[key] == undefined){
            return res.status(400).json({
                message: "Error: \'" + key + "\' is unknown"
            });
        }

        //define vars with test and the data to test
        var data = data_list[key];
        var test = test_list[key];

        //test if data is array and loop over it if it is. Else it will just test the value.
        if(Object.prototype.toString.call(data) == '[object Array]'){
            for(var list_loop = 0; list_loop < data.length; list_loop++){
                var result = testData(data[list_loop], test, key, res);
                if(result != null){
                    return result;
                }
            }
        }
        else{
            var result = testData(data, test, key, res);
            if(result != null){
                return result;
            }
        }


        req.body[key] = data;
    }
    
    next();
}

//Tests a key value pair by the parameters given in the test object.
//
//@requires data : A string or a number that shall be tested
//@requires test : A test object including the regex and other things 
//                 that the data variable should be tested aginst.
//@requires key : A string with the name of the key. Just to be displayed on error
//@requires res : The response object by express
//
//@returns : On error or failing test response with status code and error message
//           On ok test null
function testData(data, test, key, res){
    //allow_null test
    if(Object.keys(test).includes('allow_null')){
        if(!test.allow_null && data == null){
            return res.status(400).json({
                message: "For key: " + key + " is null not allowed"
            })
        }
    }

    //null test (rexex cannot be testet on null)
    if(data == null || data == undefined){
        return null;
    }

    //whitespace test
    if(Object.keys(test).includes('allow_whitespaces')){
        if(!test.allow_whitespaces && data.includes(' ')){
            return res.status(400).json({
                message: "For key: " + key + " are no whitespaces allowed"
            })
        }
    }
    
    //regex test
    if(!test.regex.test(data)){
        return res.status(400).json({
            message: "Error: Input Test failed on your Request because the input does not comply with the regulations for: \'" + key + "\'"
        })
    }

    return null;
}

//Creates a object with all key value pairs in it.
//Goes recursively over all sub objects to extract only key: values
//
//@requires data : The object with all data that should be parsed
//@optional data_list : Used to add data to the data_list on recursives
function createDatalist(data, data_list = {}){
    var keys = Object.keys(data);

    for(var key_index = 0; key_index < keys.length; key_index++){
        var current_data = data[keys[key_index]];
        if(typeof current_data == 'object'){
            if(Object.prototype.toString.call(current_data) == '[object Array]' || current_data == null){
                data_list[keys[key_index]] = current_data;
                continue;
            }
            createDatalist(current_data, data_list)
        }
        else {
            data_list[keys[key_index]] = current_data;
        }
    }
    return data_list;    
}

function createTestlist(tests){
    var test_keys = Object.keys(tests);
    var test_list = {}

    for(var test_keys_index = 0; test_keys_index < test_keys.length; test_keys_index++){
        var test = tests[test_keys[test_keys_index]];
        if(Object.keys(test).includes('aliases')){
            for(var alias = 0; alias < tests[test_keys[test_keys_index]].aliases.length; alias++){
                test_list[test.aliases[alias]] = test
            }
        }
        test_list[test_keys[test_keys_index]] = test;
    }

    return test_list;
}

module.exports = {
    checkInput: checkInput,
    TESTS: TESTS
};