const fs = require('fs');
function decodeValue(base, value) {
    return parseInt(value, base);
}
function lagrangeInterpolation(points) {
    const n = points.length;
    let c = 0;
    for (let i = 0; i < n; i++) {
        let [xi, yi] = points[i];
        let term = yi;
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                let [xj] = points[j];
                term *= -xj / (xi - xj);
            }
        }
        c += term;
    }
    return Math.round(c); 
}
function findSecretConstant(inputFile) {
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
    const { n, k } = data.keys;
    const points = [];
    for (const [key, { base, value }] of Object.entries(data)) {
        if (key !== "keys") {
            const x = parseInt(key);
            const y = decodeValue(parseInt(base), value);
            points.push([x, y]);
        }
    }
    if (points.length < k) {
        throw new Error('Not enough points to solve for the polynomial');
    }
    const constant = lagrangeInterpolation(points.slice(0, k));
    return constant;
}
try {
    const secret1 = findSecretConstant('testcase1.json');
    const secret2 = findSecretConstant('testcase2.json');
    console.log(`Test Case 1: ${secret1}`);
    console.log(`Test Case 2: ${secret2}`);
} catch (error) {
    console.error(error.message);
}
