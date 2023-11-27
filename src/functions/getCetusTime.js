module.exports = async () => {
    const filterFetch = (obj) => {
        const isDayValidation = obj['isDay'];
        const tLeft = obj['timeLeft'];

        if (isDayValidation) {
            return (`Cetus de Dia ☀️ ${tLeft.substr(0,tLeft.length-3)}`)
        } else {
            return (`Cetus de Noite 🌙 ${tLeft.substr(0,tLeft.length-3)}`)
        }
    }
     
        return fetch('https://api.warframestat.us/pc/cetusCycle/')
           .then(resposta => resposta.json())
           .then(dados => filterFetch(dados))
           .catch(erro => console.error(erro));     
}