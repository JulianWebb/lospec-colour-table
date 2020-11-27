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
            let colors = Buffer.alloc(json.colors.length * 3, json.colors.reduce((acc, cur) => acc + cur), "hex");
            let filler  = Buffer.alloc(768, "LOSPEC");
            let colorList = Buffer.concat([colors, filler], 768);
            let colorCount = json.colors.length == 256? 
                Buffer.from("0100", "hex"): 
                Buffer.concat([Buffer.alloc(1), Buffer.alloc(1, parseInt(json.colors.length, 16))]);

            let colorTable = Buffer.concat([colorList, colorCount, Buffer.alloc(2, 'FF', 'hex')], 772)

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