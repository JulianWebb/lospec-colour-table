const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.json({
        error: "missing parameter"
    })
})

app.get('/:palette.act', (req, res) => {
    let palette = req.params.palette;    
    fetch(`https://lospec.com/palette-list/${palette}.json`)
        .then(fetchRes => fetchRes.json())
        .then(json => {
            let colors = Buffer.from(json.colors.reduce((acc, cur) => acc + cur), "hex");
            let filler  = Buffer.alloc(768, "LOSPEC");
            let colorList = Buffer.concat([colors, filler], 768);
            let colorCount = Buffer.from(json.colors.length.toString(16).padStart(4, 0), "hex");
            let transparentIndex = Buffer.alloc(2, 'FF', 'hex'); // Not used so put to 0xFFFF
            let colorTable = Buffer.concat([colorList, colorCount, transparentIndex], 772)

            res.send(colorTable);
        }).catch(err => {
            console.log(err);
            res.json({
                error: "palette does not exist"
            })
        });
});

app.listen(port, () => {
    console.log(`listening on https://localhost:${port}`);
})