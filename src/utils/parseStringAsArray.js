function parseStringAsArray(string) {
    return string.split(',').map(tech => tech.trim());
}

module.exports = { parseStringAsArray }