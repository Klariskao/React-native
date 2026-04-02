declare global {
    interface String {
        capitalizeWords(): string;
    }
}

String.prototype.capitalizeWords = function (): string {
    return this.split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};