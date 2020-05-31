class ScoreWidget extends HTMLElement {

    constructor() {
        super();
    }
    
    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    addEventListeners() {
        
    }

    fetchScores() {
        
    }

    populateDOM(campaigns) {
        
    }

    render() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
            <style>

                ::-webkit-scrollbar {
                    width: 12px;
                }
                
                ::-webkit-scrollbar-track {
                    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    -webkit-box-shadow: inset 0 0 6px rgba(255,255,255,0.5); 
                }

                #score-container {
                    width: 300px;
                    height: 250px;
                    display: flex;
                    top: 8px;
                    left: 8px;
                    position: absolute;
                    font-family: 'Roboto', sans-serif;
                    border-radius: 5px;
                    background-color: #161313;
                    color: whitesmoke;
                    flex-direction: column;
                    box-shadow: inset 0px 0px 5px 2px #5d5454;
                }

                #score-container header {
                    width: 100%;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.6em;
                    font-weight: bolder;
                    border-top-left-radius: 3px;
                    border-top-right-radius: 3px;
                }
                    
                #score-list {
                    width: 100%;
                    height: 140px;
                    padding-top: 2%;
                    padding-bottom: 2%;
                    background-color: #2e2c2c;
                    border-radius: 3px;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                #score-list table {
                    width: 90%;
                    text-align: center;
                }

                #score-list table tbody {
                    overflow-y: scroll;
                    max-height: 100px;
                    display: block;
                }

                #score-list table tbody tr { 
                    display: table;
                    width: 100%;
                    table-layout: fixed;
                }

                #score-container footer {
                    width: 100%;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4em;
                    font-weight: bolder;
                }

            </style>

            <div id="score-container">
                <header>
                    <p>High Scores</p>
                </header>

                <div id="score-list">
                    <table>
                        <theader>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Score</th>
                            </tr>
                        </theader>
                        <tbody>
                            <tr class="score-record">
                                <td class="record-rank">#1</td>
                                <td class="record-username">Unknown</td>
                                <td class="record-value">0000</td>
                            </tr>
                            <tr class="score-record">
                                <td class="record-rank">#2</td>
                                <td class="record-username">Unknown</td>
                                <td class="record-value">0000</td>
                            </tr>
                            <tr class="score-record">
                                <td class="record-rank">#3</td>
                                <td class="record-username">Unknown</td>
                                <td class="record-value">0000</td>
                            </tr>
                            <tr class="score-record">
                                <td class="record-rank">#4</td>
                                <td class="record-username">Unknown</td>
                                <td class="record-value">0000</td>
                            </tr>
                            <tr class="score-record">
                                <td class="record-rank">#4</td>
                                <td class="record-username">Unknown</td>
                                <td class="record-value">0000</td>
                            </tr>
                            <tr class="score-record">
                                <td class="record-rank">#4</td>
                                <td class="record-username">Unknown</td>
                                <td class="record-value">0000</td>
                            </tr>
                            <tr class="score-record">
                                <td class="record-rank">#4</td>
                                <td class="record-username">Unknown</td>
                                <td class="record-value">0000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <footer>
                    <p>0000</p>
                </footer>
            </div>
        `;
    }
}

try {
    customElements.define('score-widget', ScoreWidget);
} catch (err) {
    const d = document.createElement('div');
    d.innerHTML = "<span style='color: red'>Algo deu errado!</span>";
    document.body.appendChild(d);
}

export { ScoreWidget };