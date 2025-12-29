export enum ThemeColorType {
    ID = "entity.name.class",
    ScriptBlock = "keyword.control",
    Boolean = "constant.language.boolean",
    Parameter = "variable.parameter",
    Number = "constant.numeric.pz",
    FullType = 'support.type.property-name',
}

export enum DiagnosticType {
    missingComma = "Missing comma",
    unmatchedBrace = "Missing closing bracket '}' for '{scriptBlock}' block",
    notValidBlock = "'{scriptBlock}' is not a valid script block",
}

// Helper function to format
export function formatDiagnostic(message: string, params: Record<string, string>): string {
    return message.replace(/{(\w+)}/g, (_, key) => params[key] ?? "");
}