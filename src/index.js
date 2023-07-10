require('dotenv').config();
const moment = require('moment');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const { Client, IntentsBitField, EmbedBuilder, time, ActionRowBuilder, StringSelectMenuBuilder} = require('discord.js');
const { channel } = require('diagnostics_channel');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.login(process.env.TOKEN);
client.on('ready', (c) =>{
    console.log(`✅ ${c.user.tag} is online`)
    c.user.setActivity(`Using !help`,);
});

// SLASH COMMANDS
client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // BUILD COMMAND
    if ((interaction.commandName === 'build') && (interaction.channelId === process.env.CHAT_BUILD_ID || interaction.channelId === process.env.CHAT_TESTBUILD_ID)){

        const buildchoice = interaction.options.get('warframe').value;
        const fs = require('fs');
        const path = (`./src/embeds/warframeBuilds/${buildchoice}.json`);

        if ((typeof(buildchoice) != 'undefined')&&(fs.existsSync(path))){

            const embed = (new EmbedBuilder(require(`../src/embeds/warframeBuilds/${buildchoice}.json`))).data ;

            if (((embed[0]).title != '') &&
                ((embed[1]).title != '') &&
                ((embed[2]).title != '') &&
                ((embed[3]).title != '') &&
                ((embed[4]).title != '') ){
                    interaction.reply({ embeds: [embed[0],embed[1],embed[2],embed[3],embed[4]], ephemeral: true  }).then(msg => setTimeout(() => msg.delete(), 600000));
                    return;
            } else if (((embed[0]).title != '') &&
                ((embed[1]).title != '') &&
                ((embed[2]).title != '') &&
                ((embed[3]).title != '') ){
                    interaction.reply({ embeds: [embed[0],embed[1],embed[2],embed[3]], ephemeral: true  }).then(msg => setTimeout(() => msg.delete(), 600000));
                    return;
            } else if (((embed[0]).title != '') &&
                ((embed[1]).title != '') &&
                ((embed[2]).title != '') ){
                    interaction.reply({ embeds: [embed[0],embed[1],embed[2]], ephemeral: true  }).then(msg => setTimeout(() => msg.delete(), 600000));
                    return;
            } else if (((embed[0]).title != '') &&
                ((embed[1]).title != '') ){
                    interaction.reply({ embeds: [embed[0],embed[1]], ephemeral: true }).then(msg => setTimeout(() => msg.delete(), 600000));
                    
                    return
            } else if (((embed[0]).title != '') ){
                    interaction.reply({ embeds: [embed[0]], ephemeral: true  }).then(msg => setTimeout(() => msg.delete(), 600000));
                    return
            };
        };
        
        // EIDOLON COMMAND 
    } else if (interaction.commandName === 'eidolon'){
        fetch("https://api.warframestat.us/pc/cetusCycle/")
            .then(res => {
            return res.json();
        })
            .then(data => {

                let daystatusON = "";
                let daystatusOFF = "";
                let matches = "";
                let hours = 0;
                let thumbstatus = "";
                let embedcolor = '';
                let currentDate = new Date();

                const timestamp = moment(currentDate).add(1,'minutes').toDate();
                const timeRegex1 = /(\d+)h (\d+)m (\d+)/;
                const timeRegex2 = /(\d+)m (\d+)/;

                if (data.timeLeft.match(timeRegex2)){
                    matches = data.timeLeft.match(timeRegex2);   
                } else if (data.timeLeft.match(timeRegex1)) {
                    matches = data.timeLeft.match(timeRegex1);
                    hours = parseInt(matches[0]);    
                };

                let minutes = parseInt(matches[1]);
                let seconds = parseInt(matches[2]);

                let timenextNightONE = moment(currentDate);
                let timenextNightTWO = moment(currentDate);
                let timenextNightTHREE = moment(currentDate);
                let timenextNightFOUR = moment(currentDate);

                let timeNow = moment(currentDate)
                .add(hours, 'hours')
                .add(minutes, 'minutes')
                .add(seconds, 'seconds')
                .toDate();

                if (data.state === 'night'){
                    thumbstatus = 'https://i.imgur.com/WjzH6UX.png'
                    embedcolor = '7419530'
                    daystatusON = "NOITE"
                    daystatusOFF = "DIA"
                    timenextNightONE = moment(timeNow)
                    .add(30, 'minutes')
                    .add(1, 'hours')
                    .toDate();

                    timenextNightTWO = moment(timeNow)
                    .add(50, 'minutes')
                    .add(3, 'hours')
                    .toDate();

                    timenextNightTHREE = moment(timeNow)
                    .add(10, 'minutes')
                    .add(6, 'hours')
                    .toDate();

                    timenextNightFOUR = moment(timeNow)
                    .add(20, 'minutes')
                    .add(9, 'hours')
                    .toDate();

                } else {
                    thumbstatus = 'https://i.imgur.com/nfot0nB.png'
                    embedcolor = '15844367'
                    daystatusON = "DIA"
                    daystatusOFF = "NOITE"
                    timenextNightONE = moment(timeNow);

                    timenextNightTWO = moment(timeNow)
                    .add(20, 'minutes')
                    .add(2, 'hours')
                    .toDate();

                    timenextNightTHREE = moment(timeNow)
                    .add(40, 'minutes')
                    .add(4, 'hours')
                    .toDate();

                    timenextNightFOUR = moment(timeNow)
                    .add(0, 'minutes')
                    .add(7, 'hours')
                    .toDate();
                };
                interaction.reply({embeds: [{
                    "title": `CETUS ESTÁ DE ${daystatusON}`,
                    "url": "https://api.warframestat.us/pc/cetusCycle/",
                    "description": `Faltam ${data.timeLeft} para ficar de ${daystatusOFF}\n\n**PROXIMAS NOITES** ⏰\n( horário de Brasília GMT -3 )\n\n- 1º --- ${moment(timenextNightONE).utcOffset(-180).format('HH:mm')}\n\n- 2º --- ${moment(timenextNightTWO).utcOffset(-180).format('HH:mm')}\n\n- 3º --- ${moment(timenextNightTHREE).utcOffset(-180).format('HH:mm')}\n\n- 4º --- ${moment(timenextNightFOUR).utcOffset(-180).format('HH:mm')}\n\n📌\n*Essa mensagem será \nDELETADA ${time(timestamp,"R")}*`,
                    "image": {
                      "url": ""
                    },
                    "thumbnail": {
                      "url": thumbstatus
                    },
                    "color": embedcolor
                }]}).then(msg => setTimeout(() => msg.delete(), 180000));
            })
                .catch(error => console.log(error));
    } else {
        interaction.reply("Esse comando não pode ser utilizado neses chat");
    };
});

// SEND CUSTOM BUTTONS ----------------------------------------------------
client.on('messageCreate', (m) =>{
    if (m.author.bot) return;
    
    if (m.content === "config.guiageral.channel"){
        if (!(m.channel.id === process.env.CHAT_GUIA_GERAL_ID)) return;
    const guiaGeralBasico =  new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('guiageralBasico')
        .setPlaceholder('Básico')
        .setMaxValues(1)
        .setOptions ([
            {label:'1.Afinidade Xp',value:'afinidadeXp',description:'XP necessária para subir o rank do warframe/arma'},
            {label:'2.Archwing',value:'archwing',description:'Veículo que possibilita missões no espaço aberto'},
            {label:'3.Batatas',value:'batatas',description:'Itens que duplicam a capacidade de mods'},
            {label:'4.Chat',value:'chat',description:'chat do game e principais comandos'},
            {label:'5.Créditos',value:'credito',description:'moeda do jogo, utilizada em todos os craftings'},
            {label:'6.Companheiros/Sentinelas',value:'companheirosSentinelas',description:'companheiros que te ajudam nas missões'},
            {label:'7.Consumíveis',value:'consumiveis',description:'itens consumíveis durante a missão, aperte "Y"'},
            {label:'8.Darvo-NoobTrap',value:'darvo',description:'NPC mercador que passa a faca nos noobs'},
            {label:'9.Dojo',value:'dojo',description:'Espaço comunitário do clã'},
            {label:'10.Endo',value:'endo',description:'item necessário para o aprimoramento de mods'},
            {label:'11.Esculturas Ayatan',value:'esculturasAyatan',description:'Item decorativo que pode ser fonde de ENDO'},
            {label:'12.Forja',value:'forja',description:'Forja da sua Orbital'},
            {label:'13.Inventário-Espaços',value:'InventarioEspacos',description:'Seu inventário de itens, espaços'},
            {label:'14.Maestria',value:'maestria',description:'Rank da sua conta no jogo'},
            {label:'15.Mercados',value:'mercado',description:'Mercado presente na sua Nave'},
            {label:'16.Modos de Jogo',value:'modosDeJogo',description:'Tipos de modo de Jogo'},
            {label:'17.Mods',value:'mods',description:'Cartas que melhoram os status do warframe/arma'},
            {label:'18.Movimentação',value:'movimentacao',description:'Dicas para uma melhor movimentação no jogo'},
            {label:'19.Navegação',value:'navegacao',description:'Módulo de Navegação da sua Nave'},
            {label:'20.Platina',value:'platina',description:'Moeda Premium do jogo, obtida trocando com players'},
            {label:'21.Ranks',value:'ranks',description:'Nível da arma/warframe aumenta capacidade de mods'},
            {label:'22.Recursos',value:'recursos',description:'Recusos de cada Planeta e como Farmá-los'},
            {label:'23.Relay',value:'relay',description:'Nave comunitária dos Tenno'},
            {label:'24.Terminais',value:'terminais',description:'Nódulos necessários para progressão de planetas'},
            {label:'25.Trocas entre Players',value:'trocaEntrePlayers',description:'Sistema de troca entre jogadores'}
        ]),
    );
    const guiaGeralIntermediario =  new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('guiaGeralIntermediario')
        .setPlaceholder('Intermediário')
        .setMaxValues(1)
        .setOptions ([
            {label:'1.Cephalon Simaris',value:'cephalonSimaris',description:'Npc que fica em qlqr Relay'},
            {label:'2.Combo Counter',value:'comboCounter',description:'Combo da sua Arma Melee'},
            {label:'3.Como Missões Recompensam?',value:'comoMissoesRecompensam',description:'Explicação sobre tabela de Drops AABC'},
            {label:'4.Conclave-PVP',value:'conclave',description:'Modo PVP do Jogo - Ninguém faz isso'},
            {label:'5.Drone Extrator',value:'droneExtrator',description:'Drone que coleta recursos de modo AFK'},
            {label:'6.Escolas de Foco',value:'escolasDeFoco',description:'Caminhos que seu Operados pode escolher'},
            {label:'7.Espectros',value:'espectros',description:'Warframes invocados durante missões'},
            {label:'8.Helminth-Troca de Habilidades',value:'helminth',description:'Npc que fica dentro da sua nave, Boquinha'},
            {label:'9.Mapas Abertos',value:'mapasAbertos',description:'Mapas gigantes com sindicatos exclusivos'},
            {label:'10.Marcas da Morte',value:'marcasDaMorte',description:'Quando voce entra na lista negra de algum boss'},
            {label:'11.Mercador Baro Kitter',value:'mercadorBaroKitter',description:'Mercador que vende Mods Prime'},
            {label:'12.Missões Pesadelo',value:'missoesPesadelo',description:'Versões mais difíceis de algumas missões'},
            {label:'13.Riven Mods',value:'rivenMods',description:'Mods exclusivos de cada arma'},
            {label:'14.Necramech',value:'necramech',description:'Veículo tanque de guerra'},
            {label:'15.Scanner',value:'scanner',description:'Item utilizado para scannear coisas...'},
            {label:'16.Sindicatos',value:'sindicatos',description:'Sindicatos onde você consegue itens únicos'},
            {label:'17.Sistema de Crítico',value:'sistemaDeCritico',description:'Como funciona o Crítico no jogo?'},
            {label:'18.Sistema de Dano',value:'sistemaDeDano',description:'Como funciona o Dano no jogo?'},
            {label:'19.Sistema de Fissuras',value:'sistemaDeFissuras',description:'Missões necessárias para se obter itens PRIME'},
            {label:'20.Sistema de Prime Vault',value:'sistemaDePrimeVault',description:'Pq alguns itens prime não estão disponíveis?'},
            {label:'21.Sistema de Login Diário',value:'sistemaDeLoginDiario',description:'Recompensas com o logín diário do game'},
            {label:'22.Sistema de Status',value:'sistemaDeStatus',description:'Como funciona o status no jogo?'},
            {label:'23.Sistema Nightwave',value:'sistemaNightwave',description:'sitema de desafios diários e semanais'},
            {label:'24.Stalker',value:'stalker',description:'Boss mais famoso do game, matador de noobs'}
        ]),
    );
    const guiaGeralAvancado =  new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('guiaGeralAvancado')
        .setPlaceholder('Avançado')
        .setMaxValues(1)
        .setOptions ([
            {label:'1.Apps para Celular',value:'appsParaCelular',description:'Apps que utilizo e recomendo'},
            {label:'2.Arbitragem',value:'arbitragem',description:'Missões onde o player possui apenas 1 vida'},
            {label:'3.Como Buildar Armas',value:'comoBuildarArmas',description:'Dicas sobre como fazer suas próprias builds'},
            {label:'4.Percuso de Aço',value:'percursoDeAco',description:'Modo Dicífil do jogo, inimigos lvl 120+'},
            {label:'5.Simulacro',value:'simulacro',description:'Teste suas builds aqui'},
            {label:'6.Tripulante Railjack',value:'tripulanteRailjack',description:'Invocáveis durante missões, ajudam bastante'},
            {label:'7.Lock-pin',value:'lockPin',description:'Marcador para Mapas Abertos não fique mais perdido'},
            {label:'7.Shield Gate',value:'shieldGate',description:'Sistema do jogo que deixa qualquer warframe tank'}
        ]),
    );

    m.channel.send({
        embeds:[{
            title:'GUIA GERAL',
            description:`Bem vindos ao nosso Guia Geral, aqui voce encontrará informações básicas, intermediárias e avançadas sobre o Warframe, bons estudos tenno 📚🤓\n\n- Obs: Assuntos mais Complexos terão seu próprio canal de guia dedicado\n- Última Atualização desse guia ${time(new Date(),'R')}\n- Alterado por kenzouframe `,
            color: '15844367',
            thumbnail:{
                url:'https://i.imgur.com/RXV7kSf.png'
            }
        }],
        components: [guiaGeralBasico,guiaGeralIntermediario,guiaGeralAvancado]
        })
    }    
});
  
// BUTTONS INTERACTIONS     -----------------------------------

client.on('interactionCreate', async (inte) => {
    // if (!(inte.customId === 'default')) return;
    if (!inte.isAnySelectMenu())return;

    const selectChoice = inte.values[0];
    const fs = require('fs');
    const path = (`./src/embeds/guia/geral/${selectChoice}.json`);

    if ((typeof(selectChoice) != 'undefined')&&(fs.existsSync(path))){

        const embed = (new EmbedBuilder(require(`../src/embeds/guia/geral/${selectChoice}.json`))).data ;
        const map = new Map(Object.entries(embed));

        let embedcount = 0
        for (let i=0;(i < map.size);i++){
            embedcount = i
        }

        if (embedcount === 0){
            inte.reply({embeds:[embed[0]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 600000));
        } else if (embedcount === 1){
            inte.reply({embeds:[embed[0],embed[1]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 600000));
        } else if (embedcount === 2){
            inte.reply({embeds:[embed[0],embed[1],embed[2]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 600000)); 
        } else if (embedcount === 3){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 600000)); 
        } else if (embedcount === 4){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 600000)); 
        } else if (embedcount === 5){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4],embed[5]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 600000)); 
        } else if (embedcount === 6){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4],embed[5],embed[6]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 600000)); 
        } else if (embedcount === 7){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4],embed[5],embed[6],embed[7]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 600000)); 
        } else if (embedcount === 8){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4],embed[5],embed[6],embed[7],embed[8]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 600000)); 
        } else { inte.reply({content:'esse guia possui mais de 4 embeds ... ❌',ephemeral:'true'}).then(msg => setTimeout(() => msg.delete(), 6000))}
    } else { inte.reply({content:'essa interação ainda não está pronta ... 🙄',ephemeral:'true'}).then(msg => setTimeout(() => msg.delete(), 6000))}
})