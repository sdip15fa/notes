var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var url = "https://api-notes.wcyat.me";
if (localStorage.k && localStorage.username) {
    if (localStorage.alerted) {
        delete localStorage.alerted;
    }
    window.location.replace("../?signedin=true");
}
function testserver(link) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    r = false;
                    // @ts-ignore
                    return [4 /*yield*/, axios
                            .get("".concat(link, "/testconnection"))
                            .then(function () {
                            r = true;
                        })["catch"](function () { })];
                case 1:
                    // @ts-ignore
                    _a.sent();
                    return [2 /*return*/, r];
            }
        });
    });
}
function signup() {
    if (!document.getElementById("username")["value"] ||
        !document.getElementById("password")["value"]) {
        document.getElementById("warning").innerHTML =
            "Username / password cannot be empty.";
        return;
    }
    // @ts-ignore
    axios
        .post("".concat(url, "/users/signup"), {
        username: document.getElementById("username")["value"],
        password: document.getElementById("password")["value"]
    })
        .then(function (res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        localStorage.username = document.getElementById("username")["value"];
                        _a = localStorage;
                        return [4 /*yield*/, res.data];
                    case 1:
                        _a.k = _b.sent();
                        if (localStorage.alerted) {
                            delete localStorage.alerted;
                        }
                        window.location.replace("../?signup=successful");
                        return [2 /*return*/];
                }
            });
        });
    })["catch"](function (error) {
        document.getElementById("warning").innerHTML = error.response.data;
    });
}
function signin() {
    // @ts-ignore
    axios
        .post("".concat(url, "/users/signin"), {
        username: document.getElementById("username")["value"],
        password: document.getElementById("password")["value"]
    })
        .then(function (res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = localStorage;
                        return [4 /*yield*/, res.data];
                    case 1:
                        _a.k = _b.sent();
                        localStorage.username = document.getElementById("username")["value"];
                        if (localStorage.alerted) {
                            delete localStorage.alerted;
                        }
                        window.location.replace("../?signin=successful");
                        return [2 /*return*/];
                }
            });
        });
    })["catch"](function (error) {
        document.getElementById("warning").innerHTML = error.response.data;
    });
}
function check(id) {
    if (!document.getElementById(id)["value"]) {
        document.getElementById("warning").innerHTML =
            "Username / password cannot be empty.";
    }
    else {
        document.getElementById("warning").innerHTML = "";
    }
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var urllist, _i, urllist_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urllist = [
                        "https://api-notes.wcyat.me",
                        "https://notes-server.wcyat.me",
                        "https://api.notes.wcyat.me",
                    ];
                    _i = 0, urllist_1 = urllist;
                    _a.label = 1;
                case 1:
                    if (!(_i < urllist_1.length)) return [3 /*break*/, 4];
                    i = urllist_1[_i];
                    return [4 /*yield*/, testserver(i)];
                case 2:
                    if (_a.sent()) {
                        url = i;
                        return [3 /*break*/, 4];
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
init();
