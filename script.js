async function fetchCSV(url) {
    const response = await fetch(url);
    const csvText = await response.text();

    // Split rows by newline and columns by semicolon
    const rows = csvText.split("\n").map(row => row.split(";"));
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
        const obj = {};
        row.forEach((value, index) => {
            obj[headers[index].trim()] = value.trim();
        });
        return obj;
    });
    console.log(data)
    return data;
}

const csvUrl = "movies.csv"


fetchCSV(csvUrl);