const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // for working on older node js versions
module.exports = async (mName) => {
    function filterObjectByModName(objects, modName) {
        const filteredObj = objects.filter(object => object.modName.toLocaleLowerCase() === modName);
        if (filteredObj[0] !== undefined) {
            return filteredObj;
        } else {
            return 'notFound';
        }
    }
     
        return fetch('http://drops.warframestat.us/data/modLocations.json')
           .then(resposta => resposta.json())
           .then(dados => filterObjectByModName(dados.modLocations,mName))
           .then(dados => {return dados})
           .catch(erro => console.error(erro));     
}