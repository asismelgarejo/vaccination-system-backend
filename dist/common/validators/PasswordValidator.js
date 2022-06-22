"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPasswordValid = void 0;
const isPasswordValid = (password) => {
    const passwordTestResult = {
        message: "",
        isValid: true,
    };
    if (password.length < 8) {
        passwordTestResult.message = "Password must be at least 8 characters";
        passwordTestResult.isValid = false;
        return passwordTestResult;
    }
    return passwordTestResult;
};
exports.isPasswordValid = isPasswordValid;
//# sourceMappingURL=PasswordValidator.js.map