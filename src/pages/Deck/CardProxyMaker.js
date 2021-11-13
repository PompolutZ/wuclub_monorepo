class Template extends Component {
    state = {
        cards: [],
    }

    componentDidMount = () => {
        //'1_02024', '1_02049', '2_02049', '1_03550', '1_03551', '1_03323', '1_03322', '1_01257', '1_01348',
        this.setState({
            cards: [
                '1_01190',
                '1_01180',
                '1_01291',
                '1_01192',
                '1_01391',
                '1_01183',
                '1_03493',
                '1_01194',
                '1_03373',
                '1_01361',
                '1_03550',
                '1_01273',
                '1_03385',
                '1_03551',
                '1_03420',
                '1_01331',
                '1_01343',
                '1_01178',
                '1_01201',
                '1_01234',
                '1_03302',
                '1_01334',
                '1_01257',
                '1_01378',
                '1_01389',
                '1_03503',
                '1_03305',
                '1_01348',
                '1_01327',
                '1_01339',
                '1_01306',
                '1_03529',
            ],
        }) //
    }

    render() {
        return (
            <div>
                <Button onClick={this.handlePrint}>Print</Button>
                {this.state.cards.map(c => {
                    return (
                        <img
                            id={c}
                            key={c}
                            src={`/assets/cards/${c.slice(-5)}.png`}
                        />
                    )
                })}
            </div>
        )
    }

    handlePrint = () => {
        import('jspdf').then(({ default: jsPDF }) => {
            let doc = new jsPDF({
                unit: 'mm',
            })

            const w = 64.5
            const h = 89.9

            const pages = this.state.cards.reduce((acc, el, index, array) => {
                if (index % 9 === 0) {
                    acc.push(array.slice(index, index + 9))
                }
                return acc
            }, [])

            console.log(pages)
            for (let page of pages) {
                {
                    const index = pages.indexOf(page)
                    if (index > 0) {
                        doc.addPage()
                    }
                }

                let rowIdx = 0
                let x = 3
                let y = 3
                let idx = 0

                for (let c of page) {
                    doc.addImage(
                        document.getElementById(c),
                        'png',
                        x,
                        y,
                        w,
                        h,
                        '',
                        'SLOW'
                    )
                    x += w + 3
                    idx += 1

                    if (idx % 3 === 0) {
                        rowIdx += 1
                        x = 3
                        y = rowIdx * h + rowIdx * 5
                        console.log(x, y)
                    }
                }
            }

            doc.save('cards.pdf')
        })
    }
}