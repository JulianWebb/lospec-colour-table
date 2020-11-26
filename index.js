const e = require('express');
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
            
            if (json.colors.length == 256) {
                colourCount = Buffer.from("0100", "hex");
            } else {
                colourCount = Buffer.concat([Buffer.alloc(1), Buffer.alloc(1, parseInt(json.colors.length, 16))]);
                
            }
            let colours = json.colors.reduce((acc, cur, idx, src) => {
                return acc + cur
            })
            let colourTable = Buffer.concat([Buffer.alloc(colours.length / 2, colours, 'hex'), Buffer.alloc(768, "LOSPEC")], 768)
            colourTable = Buffer.concat([colourTable, colourCount, Buffer.alloc(2, 'FFFF', 'hex')], 772)

            res.send(colourTable);
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