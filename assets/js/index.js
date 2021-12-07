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
//import tinymce from "tinymce";
//import axios from "axios";
var r = false;
var id = localStorage.id;
var usernotes, edittimeout;
var url = "https://api-notes.wcyat.me";
var alerthtml = document.getElementById("alert");
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function link() {
    var link = document.createElement("p");
    link.id = "link";
    link.innerHTML = "Share this note by url: <a href=\"".concat(window.location.href.split("?")[0], "?id=").concat(id, "\">").concat(window.location.href.split("?")[0], "?id=").concat(id, "</a>");
    document.getElementById("root").appendChild(link);
}
function alertmessage(c, text) {
    return __awaiter(this, void 0, void 0, function () {
        var a;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    a = alerthtml;
                    a.innerHTML = text;
                    a.className = c;
                    document.body.insertBefore(a, document.querySelector("h1").nextSibling);
                    return [4 /*yield*/, sleep(5000)];
                case 1:
                    _a.sent();
                    document.getElementById("alert").remove();
                    localStorage.alerted = true;
                    return [2 /*return*/];
            }
        });
    });
}
function newnote(text) {
    return __awaiter(this, void 0, void 0, function () {
        var i, div;
        return __generator(this, function (_a) {
            i = 1;
            for (i; true; i++) {
                // @ts-ignore
                if (tinymce.get("".concat(i)) === null) {
                    break;
                }
            }
            div = document.createElement("div");
            div.innerHTML = "<br><textarea id=\"".concat(i, "\" rows=\"10\" name=\"note\">").concat(text, "</textarea>\n</div>");
            document
                .getElementById("root")
                .insertBefore(div, document.getElementById("btn"));
            // @ts-ignore
            tinymce.init({
                selector: "textarea",
                init_instance_callback: function (editor) {
                    editor.on("Paste Change input Undo Redo", function () {
                        clearTimeout(edittimeout);
                        edittimeout = setTimeout(function () {
                            usercreate(editor.id);
                        }, 500);
                    });
                }
            });
            return [2 /*return*/];
        });
    });
}
function logout() {
    delete localStorage.k;
    delete localStorage.username;
    if (localStorage.alerted) {
        delete localStorage.alerted;
    }
    window.location.replace("".concat(window.location.href.split("?")[0], "?logout=successful"));
}
function getvar(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var _i = 0, vars_1 = vars; _i < vars_1.length; _i++) {
        var i = vars_1[_i];
        var pair = i.split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return "";
}
function usercreate(id) {
    if (!usernotes) {
        usernotes = {
            key: localStorage.k
        };
    }
    // @ts-ignore
    usernotes[id] = tinymce.get(id).getContent();
    // @ts-ignore
    axios
        .post("".concat(url, "/notes/users/").concat(localStorage.k), usernotes)
        .then(function (res) {
        console.log(res.data);
    })["catch"](function () {
        alertmessage("alert alert-danger", "404 not found");
    });
}
function anon() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getvar("id")];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, getvar("id")];
                case 2:
                    id = _a.sent();
                    localStorage.id = id;
                    _a.label = 3;
                case 3:
                    if (!(id === undefined)) return [3 /*break*/, 5];
                    // @ts-ignore
                    return [4 /*yield*/, axios.get("https://notes.wcyat.me/idgenerator").then(function (res) {
                            id = res.data;
                            localStorage.id = id;
                        })];
                case 4:
                    // @ts-ignore
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: 
                // @ts-ignore
                return [4 /*yield*/, axios.get("".concat(url, "/get/").concat(id)).then(function (res) {
                        // @ts-ignore
                        tinymce.get("note").setContent(res.data.text);
                    })];
                case 6:
                    // @ts-ignore
                    _a.sent();
                    link();
                    _a.label = 7;
                case 7:
                    r = true;
                    return [2 /*return*/];
            }
        });
    });
}
function createnote(text) {
    ;
    var data = {
        id: id,
        text: text
    };
    // @ts-ignore
    axios
        .post("".concat(url, "/create"), data)
        .then(function (response) {
        console.log(response);
    })["catch"](function (error) {
        console.log(error);
    });
    if (document.getElementById("link") === null) {
        link();
    }
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
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var urllist, _i, urllist_1, i, btn;
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
                case 4:
                    if (getvar("signedin") ||
                        getvar("signup") ||
                        getvar("signin") ||
                        getvar("logout")) {
                        if (localStorage.alerted) {
                            window.location.replace(window.location.href.split("?")[0]);
                        }
                        else {
                            alertmessage(getvar("signedin") ? "alert alert-warning" : "alert alert-success", getvar("signedin")
                                ? "You are already signed in as ".concat(localStorage.username, ".")
                                : getvar("logout")
                                    ? "Successfully logged out."
                                    : "Successfully signed ".concat(getvar("signup") ? "up" : "in", " as ").concat(localStorage.username, "."));
                        }
                    }
                    if (localStorage.username && localStorage.k) {
                        document.getElementById("header").innerHTML = "<button\n    style=\"margin-top: 10px; margin-right: 10px\"\n    class=\"btn btn-secondary float-end\"\n    onclick=\"logout()\"\n  >\n    Log out\n  </button>";
                        document.getElementById("note").remove();
                        // @ts-ignore
                        tinymce.EditorManager.execCommand("mceRemoveEditor", true, "note");
                        btn = document.createElement("div");
                        btn["className"] = "delta";
                        btn["id"] = "btn";
                        btn["innerHTML"] =
                            "<button class=\"btn btn-primary\" onclick=newnote('')>Create</button>";
                        document.getElementById("root").appendChild(btn);
                        // @ts-ignore
                        axios.get("".concat(url, "/notes/users/").concat(localStorage.k)).then(function (res) {
                            for (var i in res.data) {
                                newnote(res.data[i]);
                            }
                            usernotes = res.data;
                            usernotes["key"] = localStorage.k;
                        });
                    }
                    else {
                        anon();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
init();
