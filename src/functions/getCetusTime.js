module.exports = async () => {
    const filterFetch = (obj) => {
        const isDayValidation = obj['isDay'];
        const tLeft = obj['timeLeft'];
        
        // console.log(isDayValidation);
        // console.log(tLeft);
        
        if (isDayValidation) {
            return (`Cetus☀️ ${tLeft.substr(0,tLeft.length-3)}`)
        } else {
            return (`Cetus🌙 ${tLeft.substr(0,tLeft.length-3)}`)
        }
    }
    
    return await fetch('https://api.warframestat.us/pc/cetusCycle/')
       .then(resposta => resposta.json())
       .then(dados => (filterFetch(dados)))
       .catch(erro => console.error(erro));     
}