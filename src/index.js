require('dotenv').config();
const moment = require('moment');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); // for working on older node js versions

const { Client, IntentsBitField, EmbedBuilder, time, ActionRowBuilder, StringSelectMenuBuilder, Emoji} = require('discord.js');
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
    c.user.setActivity(`/eidolon e guias`,);
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
                    "description": `Faltam ${data.timeLeft} para ficar de ${daystatusOFF}\n\n**PROXIMAS NOITES** ⏰\n( horário de Brasília GMT -3 )\n\n- 1º --- ${moment(timenextNightONE).utcOffset(-180).format('HH:mm')}\n\n- 2º --- ${moment(timenextNightTWO).utcOffset(-180).format('HH:mm')}\n\n- 3º --- ${moment(timenextNightTHREE).utcOffset(-180).format('HH:mm')}\n\n- 4º --- ${moment(timenextNightFOUR).utcOffset(-180).format('HH:mm')}`,
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
    if (m.author.id !== process.env.OWNER_ID) return;
  
    
    if (m.content === "config.guiageral.channel"){   // MENU GUIA GERAL
        if (!(m.channel.id === process.env.CHAT_GUIA_GERAL_ID)) return;
    const guiaGeralBasico =  new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('guiageralBasico')
        .setPlaceholder('Selecione uma Informação Básica')
        .setMaxValues(1)
        .setOptions ([
            {label:'Afinidade Xp',value:'afinidadeXp',description:'XP necessária para subir o rank do warframe/arma',emoji:'🔹'},
            {label:'Archwing',value:'archwing',description:'Veículo que possibilita missões no espaço aberto',emoji:'🔸'},
            {label:'Batatas',value:'batatas',description:'Itens que duplicam a capacidade de mods',emoji:'<:reactor:1128440942337212528>'},
            {label:'Chat',value:'chat',description:'chat do game e principais comandos',emoji:'💬'},
            {label:'Créditos',value:'credito',description:'moeda do jogo, utilizada em todos os craftings',emoji:'<:creditos:1128440914117939283>'},
            {label:'Companheiros/Sentinelas',value:'companheirosSentinelas',description:'companheiros que te ajudam nas missões',emoji:'🔸'},
            {label:'Consumíveis',value:'consumiveis',description:'itens consumíveis durante a missão, aperte "Y"',emoji:'🔹'},
            {label:'Darvo-NoobTrap',value:'darvo',description:'NPC mercador que passa a faca nos noobs',emoji:'<:darvosmug:1128440922670116874>'},
            {label:'Dojo',value:'dojo',description:'Espaço comunitário do clã',emoji:'🔹'},
            {label:'Endo',value:'endo',description:'item necessário para o aprimoramento de mods',emoji:'<:endo:1128440928923816067>'},
            {label:'Esculturas Ayatan',value:'esculturasAyatan',description:'Item decorativo que pode ser fonde de ENDO',emoji:'🔹'},
            {label:'Forja',value:'forja',description:'Forja da sua Orbital',emoji:'🔸'},
            {label:'Inventário-Espaços',value:'InventarioEspacos',description:'Seu inventário de itens, espaços',emoji:'🔹'},
            {label:'Maestria',value:'maestria',description:'Rank da sua conta no jogo',emoji:'<:warframe:1128436969341456587>'},
            {label:'Mercados',value:'mercado',description:'Mercado presente na sua Nave',emoji:'🛒'},
            {label:'Modos de Jogo',value:'modosDeJogo',description:'Tipos de modo de Jogo',emoji:'🔸'},
            {label:'Mods',value:'mods',description:'Cartas que melhoram os status do warframe/arma',emoji:'<:forma:1128436956062302218>'},
            {label:'Movimentação',value:'movimentacao',description:'Dicas para uma melhor movimentação no jogo',emoji:'🔸'},
            {label:'Navegação',value:'navegacao',description:'Módulo de Navegação da sua Nave',emoji:'🔹'},
            {label:'Platina',value:'platina',description:'Moeda Premium do jogo, obtida trocando com players',emoji:'<:platina:1128440939568967740>'},
            {label:'Ranks',value:'ranks',description:'Nível da arma/warframe aumenta capacidade de mods',emoji:'🔹'},
            {label:'Recursos',value:'recursos',description:'Recusos de cada Planeta e como Farmá-los',emoji:'🔸'},
            {label:'Relay',value:'relay',description:'Nave comunitária dos Tenno',emoji:'🔹'},
            {label:'Terminais',value:'terminais',description:'Nódulos necessários para progressão de planetas',emoji:'🔸'},
            {label:'Trocas entre Players',value:'trocaEntrePlayers',description:'Sistema de troca entre jogadores',emoji:'💱'}
        ]),
    );
    const guiaGeralIntermediario =  new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('guiaGeralIntermediario')
        .setPlaceholder('Selecione uma Informação Intermediária')
        .setMaxValues(1)
        .setOptions ([
            {label:'Cephalon Simaris',value:'cephalonSimaris',description:'Npc que fica em qlqr Relay',emoji:'🔹'},
            {label:'Combo Counter',value:'comboCounter',description:'Combo da sua Arma Melee',emoji:'🔸'},
            {label:'Como Missões Recompensam?',value:'comoMissoesRecompensam',description:'Explicação sobre tabela de Drops AABC',emoji:'🔹'},
            {label:'Conclave-PVP',value:'conclave',description:'Modo PVP do Jogo - Ninguém faz isso',emoji:'🔸'},
            {label:'Drone Extrator',value:'droneExtrator',description:'Drone que coleta recursos de modo AFK',emoji:'🔹'},
            {label:'Escolas de Foco',value:'escolasDeFoco',description:'Caminhos que seu Operados pode escolher',emoji:'<:maudurai:1128436790320169121>'},
            {label:'Espectros',value:'espectros',description:'Warframes invocados durante missões',emoji:'🔹'},
            {label:'Helminth-Troca de Habilidades',value:'helminth',description:'Npc que fica dentro da sua nave, Boquinha',emoji:'🔸'},
            {label:'Mapas Abertos',value:'mapasAbertos',description:'Mapas gigantes com sindicatos exclusivos',emoji:'🔹'},
            {label:'Marcas da Morte',value:'marcasDaMorte',description:'Quando voce entra na lista negra de algum boss',emoji:'🔸'},
            {label:'Mercador Baro Kitter',value:'mercadorBaroKitter',description:'Mercador que vende Mods Prime',emoji:'<:baro:1128440909038620692>'},
            {label:'Missões Pesadelo',value:'missoesPesadelo',description:'Versões mais difíceis de algumas missões',emoji:'🔸'},
            {label:'Riven Mods',value:'rivenMods',description:'Mods exclusivos de cada arma',emoji:'🔹'},
            {label:'Necramech',value:'necramech',description:'Veículo tanque de guerra',emoji:'🔸'},
            {label:'Scanner',value:'scanner',description:'Item utilizado para scannear coisas...',emoji:'🔹'},
            {label:'Sindicatos',value:'sindicatos',description:'Sindicatos onde você consegue itens únicos',emoji:'<:cephalonsuda:1128437282026815648>'},
            {label:'Sistema de Crítico',value:'sistemaDeCritico',description:'Como funciona o Crítico no jogo?',emoji:'🔹'},
            {label:'Sistema de Dano',value:'sistemaDeDano',description:'Como funciona o Dano no jogo?',emoji:'🔸'},
            {label:'Sistema de Fissuras',value:'sistemaDeFissuras',description:'Missões necessárias para se obter itens PRIME',emoji:'<:axirelic:1128440906199085247>'},
            {label:'Sistema de Prime Vault',value:'sistemaDePrimeVault',description:'Pq alguns itens prime não estão disponíveis?',emoji:'🔸'},
            {label:'Sistema de Login Diário',value:'sistemaDeLoginDiario',description:'Recompensas com o logín diário do game',emoji:'🔹'},
            {label:'Sistema de Status',value:'sistemaDeStatus',description:'Como funciona o status no jogo?',emoji:'🔸'},
            {label:'Sistema Nightwave',value:'sistemaNightwave',description:'sitema de desafios diários e semanais',emoji:'🔹'},
            {label:'Stalker',value:'stalker',description:'Boss mais famoso do game, matador de noobs',emoji:'<:stalker:1128440948175683674>'}
        ]),
    );
    const guiaGeralAvancado =  new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId('guiaGeralAvancado')
        .setPlaceholder('Selecione uma Informação Avançada')
        .setMaxValues(1)
        .setOptions ([
            {label:'Apps para Celular',value:'appsParaCelular',description:'Apps que utilizo e recomendo',emoji:'🔸'},
            {label:'Arbitragem',value:'arbitragem',description:'Missões onde o player possui apenas 1 vida',emoji:'🔹'},
            {label:'Como Buildar Armas',value:'comoBuildarArmas',description:'Dicas sobre como fazer suas próprias builds',emoji:'🔸'},
            {label:'Percuso de Aço',value:'percursoDeAco',description:'Modo Dicífil do jogo, inimigos lvl 120+',emoji:'🔹'},
            {label:'Simulacro',value:'simulacro',description:'Teste suas builds aqui',emoji:'🔸'},
            {label:'Tripulante Railjack',value:'tripulanteRailjack',description:'Invocáveis durante missões, ajudam bastante',emoji:'🔹'},
            {label:'Lock-pin',value:'lockPin',description:'Marcador para Mapas Abertos não fique mais perdido',emoji:'🔸'},
            {label:'Shield Gate',value:'shieldGate',description:'Sistema do jogo que deixa qualquer warframe tank',emoji:'🔹'}
        ]),
    );

    m.channel.send({
        embeds:[{
            description:`Bem vindos ao nosso **Guia Geral**, aqui voce encontrará informações básicas, intermediárias e avançadas sobre o Warframe, caso encontre alguma informação errada/desatualizada mande um PM para o kenzouframe 🛠\n\n- Obs: Assuntos mais Complexos terão seu próprio canal de guia dedicado\n- Última Atualização desse guia ${time(new Date(),'R')}`,
            color: '14032414',
            image:{
                url:'https://i.imgur.com/pykSyqF.png'
            }
        }],
        files:[{
            attachment:"./src/embeds/attach/header_guiaGeral.png",
            name:'header_guiaGeral.png',
            description:'logo do guia'
        }],
        components: [guiaGeralBasico,guiaGeralIntermediario,guiaGeralAvancado]
        })

    } else if (m.content === "config.guiajornadas.channel"){   // MENU GUIA JORNADAS
        if (!(m.channel.id === process.env.CHAT_GUIA_JORNADAS_ID)) return;
        const guiaJornadasPrincipais =  new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('guiaJornadasPrincipais')
            .setPlaceholder('Selecione uma Jornada Principal')
            .setMaxValues(1)
            .setOptions ([
                {label:'O Paradoxo de Duviri',value:'oParadoxodeDuviri',description:'Conheça o mapa Aberto chamado Duviri',emoji:'🔸'},
                {label:'O Despertar',value:'oDespertar',description:'Jornada inicial do game, aprenda comandos básicos',emoji:'🔹'},
                {label:'Recompensa de Vor',value:'recompensaDeVor',description:'Jornada para remover o bagui da sua perna',emoji:'🔸'},
                {label:'Uma Vez Acordado',value:'umaVezAcordado',description:'Jornada que apresenta o player aos infestados',emoji:'🔹'},
                {label:'A Archwing',value:'aArchwing',description:'Construa seu primeiro veículo, archwing',emoji:'🔸'},
                {label:'Sonhos Roubados',value:'sonhosRoubados',description:'Conheça e ajude o npc mercador Maroo',emoji:'🔹'},
                {label:'O Novo Estranho',value:'oNovoEstranho',description:'Conheça e ajude o npc Cephalon Suda',emoji:'🔸'},
                {label:'Natah',value:'natah',description:'Descubra o passado obscuro da sua SpaceMomy',emoji:'🔹'},
                {label:'Segundo Sonho',value:'segundoSonho',description:'Ache seu verdadeiro eu, acorde desse sonho eterno',emoji:'🔸'},
                {label:'Guerra Interior',value:'guerraInterior',description:'Aprenda a controlar seus novos poderes',emoji:'🔹'},
                {label:'Correntes de Harrow',value:'correntesDeHarrow',description:'Investigue o misterioso Rell',emoji:'🔸'},
                {label:'Prólogo da Apostasia',value:'prologoDaApostasia',description:'Hora de perder sua SpaceMomy para o Ballas',emoji:'🔹'},
                {label:'O Sacrifício',value:'oSacrificio',description:'Descubra um warframe teimoso, Excalibur Umbra',emoji:'🔸'},
                {label:'O Prelúdio da Guerra',value:'oPreludioDaGuerra',description:'Preparativos para guerra que está por vir',emoji:'🔹'},
                {label:'A Nova Guerra',value:'aNovaGuerra',description:'A guerra, jornada longa, tire o dia para fazer...',emoji:'🔸'},
                {label:'Anjos da Zariman',value:'anjosDaZariman',description:'Conheça a nave Zariman e ajude seus tripulates',emoji:'🔹'},
                {label:'Destrutor de Véus',value:'destrutorDeVeus',description:'Ajude o Kahl-175 um grinner gente boa',emoji:'🔸'}
            ]),
        );
        const guiaJornadasSecundarias =  new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('guiaJornadasSecundarias')
            .setPlaceholder('Selecione uma Jornada Secundária')
            .setMaxValues(1)
            .setOptions ([
                {label:'Um Homem de Poucas Palavras',value:'umHomemDePoucasPalavras',description:'ajude e seja ajudado pelo nosso querido CLEM'},
                {label:'Uivo do Kubrow',value:'uivoDoKubrow',description:'conquiste seu primeiro companheiro',emoji:'🔹'},
                {label:'Vigília de Saya',value:'vigiliaDeSaya',description:'Conheça o mapa aberto de Cetus',emoji:'🔸'},
                {label:'Vox Solaris',value:'voxSolaris',description:'Conheça o mapa aberto de Fortuna',emoji:'🔹'},
                {label:'Coração de Deimos',value:'coracaoDeDeimos',description:'Conheça o mapa aberto de Deimos',emoji:'🔸'},
                {label:'A Surfista',value:'aSurfista',description:'prove seus talentos com o skate k-drive',emoji:'🔹'},
                {label:'O Protocolo DeadLock',value:'oProtocoloDeadlock',description:'entre no void, conquiste o warframe Protea',emoji:'🔸'},
                {label:'O Teorema Limbo',value:'oTeoremaLimbo',description:'Desvende mistérios e conquiste o warframe Limbo',emoji:'🔹'},
                {label:'Hino de Octavia',value:'hinoDeOctavia',description:'Descubra o poder da música',emoji:'🔸'},
                {label:'Areias de Inaros',value:'areiasDeInaros',description:'ajude o Baro Kitter e conquiste o deserto de Marte',emoji:'🔹'},
                {label:'O Bosque Prateado',value:'oBosquePrateado',description:'Descubra os mistérios das plantas',emoji:'🔸'},
                {label:'Paciente Zero',value:'pacienteZero',description:'Enfrente a versão infestada do boss de Júpiter',emoji:'🔹'},
                {label:'O Preceito de Jordas',value:'oPreceitoDeJordas',description:'Não faça essa jornada se tiver archwing fraca',emoji:'🔸'},
                {label:'Mensagens Ocultas',value:'mensagensOcultas',description:'Desvende charádas... ou apenas leia os spoilers',emoji:'🔹'},
                {label:'A Jogada de Glast',value:'aJogadaDeGlast',description:'Conquiste o diagrama do warframe Nidus',emoji:'🔸'},
                {label:'A Máscara de Revenant',value:'aMascaraDeRevenant',description:'Consquiste o diagrama do warframe Revenant',emoji:'🔹'},
                {label:'O Chamado da Tempestarii',value:'oChamadoDaTempestarii',description:'Persiga e capture uma nave fantasma',emoji:'🔸'},
                {label:'Maré Ascendente',value:'mareAscendente',description:'Construa sua Nave de Guerra, Railjack',emoji:'🔹'}
            ]),
        );
    
        m.channel.send({
            embeds:[{
                description:`Bem vindos ao nosso **Guia de Jornadas**, aqui voce encontrará informações sobre as **JORNADAS PRINCIPAIS** ( Essenciais para progessão no game e Desbloqueio do Modo **PERCURSO DE AÇO/ARBITRAGEM** ) e **JORNADAS SECUNDÁRIAS** ( Totalmente Opcionais ), bons estudos tenno: 📚🤓\n\n- As jornadas principais estão em ordem de completa, porém as secundárias não.\n- A jornada **O Paradoxo de Duviri** é opcional, porém está como principal pois o jogador pode escolher começar o game por ela, então coloquei na posição 1.\n- Última Atualização desse guia ${time(new Date(),'R')}`,
                color: '14032414',
                image:{
                    url:'https://i.imgur.com/XZAb0Iy.png'
                }
            }],
            files:[{
                attachment:"./src/embeds/attach/header_guiaJornadas.png",
                name:'header_guiaJornadas.png',
                description:'logo do guia'
            }],
            components: [guiaJornadasPrincipais,guiaJornadasSecundarias]
            })


    } else if (m.content === "config.guiafarm.channel"){   // MENU GUIA FARM
        if (!(m.channel.id === process.env.CHAT_GUIA_FARM_ID)) return;
        const guiaFarm =  new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('guiaFarm')
            .setPlaceholder('Selecione um item ou categoria')
            .setMaxValues(1)
            .setMinValues(1)
            .setOptions ([
                {label:'Farm de Créditos',value:'farmCreditos',description:'Maneiras mais eficientes de farmar Créditos',emoji:'🔸'},
                {label:'Farm de Afinidade(XP)',value:'farmAfinidade',description:'Maneiras mais eficientes de farmar Afinidade',emoji:'🔹'},
                {label:'Farm Endo',value:'farmEndo',description:'Maneiras mais eficientes de farmar Endo',emoji:'🔸'},
                {label:'Dicas de Farm',value:'dicasDeFarm',description:'dicas para se farmar de forma eficiente',emoji:'🔹'},
                {label:'Farm Recursos I',value:'farmRecursosI',description:'Veja o melhor local de farm de cada recurso I',emoji:'🔸'},
                {label:'Farm Recursos II',value:'farmRecursosII',description:'Veja o melhor local de farm de cada recurso II',emoji:'🔹'},
                {label:'Farm de Foco',value:'farmFoco',description:'Maneiras mais eficientes de farmar Foco',emoji:'🔸'},
                {label:'Farm Kuva',value:'farmKuva',description:'Maneiras mais eficientes de farmar Kuva',emoji:'🔹'},
                {label:'Farm Relíquias',value:'farmReliquias',description:'Maneiras mais eficientes de farmar cada Relíquia',emoji:'🔸'},
                {label:'Farm Traços do Void',value:'farmTracosDoVoid',description:'Onde conseguir Traços do Void?',emoji:'🔹'},
                {label:'Farm Mods Corrompidos',value:'farmModsCorrompidos',description:'Onde e como conseguir Mods Corrompidos?',emoji:'🔸'},
                {label:'Farm Mods Pesadelo',value:'farmModsPesadelo',description:'Maneiras mais eficientes de farma Mods Pesadelo',emoji:'🔹'},
                {label:'Farm Aya',value:'farmAya',description:'Maneiras mais eficientes de farma Aya',emoji:'🔸'},
                {label:'Farm de Coroas de Granum',value:'farmDeCoroasDeGranum',description:'Moedas que servem para entrar no Granum Void',emoji:'🔹'},
                {label:'Farm de Warframes I',value:'farmDeWarframesI',description:'Locais de Farm para todos os warframes normais 1',emoji:'🔸'},
                {label:'Farm de Warframes II',value:'farmDeWarframesII',description:'Locais de Farm para todos os warframes normais 2',emoji:'🔹'},
                {label:'Farm de Warframes III',value:'farmDeWarframesIII',description:'Locais de Farm para todos os warframes normais 3',emoji:'🔸'}
            ]),
        );
    
        m.channel.send({
            embeds:[{
                description:`Bem vindos ao nosso Guia de Farm, aqui voce encontrará informações sobre como obter os itens do game de forma eficiente e direta. Caso o guia esteja com alguma informação errada/faltando, mande um PM para o kenzouframe arrumar 🛠 \n\n- Recursos de Railjack e Mapas Abertos como Cetus,Fortuna, Deimos, Zariman e Duviri estão em seus respectivos canais próprios(para não confundir vcs com muita informação)\n- Utilizei várias fontes na internet para fazer esse guia, como essa [aqui](https://steamcommunity.com/sharedfiles/filedetails/?id=522046479) junto com meus 7 anos de experiência no joguin \n- Última Atualização desse guia ${time(new Date(),'R')}`,
                color: '14032414',
                image:{
                    url:'https://i.imgur.com/MqSyBBR.png'
                }
            }],
            files:[{
                attachment:"./src/embeds/attach/header_guiaFarm.png",
                name:'header_guiaFarm.png',
                description:'logo do guia'
            }],
            components: [guiaFarm]
            })
    } else if (m.content === "config.guiacetus.channel"){   // MENU GUIA CETUS
        if (!(m.channel.id === process.env.CHAT_GUIA_CETUS_ID)) return;
        const guiaCetus =  new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('guiaCetus')
            .setPlaceholder('Selecione um item')
            .setMaxValues(1)
            .setMinValues(1)
            .setOptions ([
                {label:'Npcs',value:'npcsDeCetus',description:'Um breve resumo sobre o que cada NPC oferece',emoji:'🔸'},
                {label:'Farm de Reputação',value:'farmDeReputacaoCetus',description:'Maneiras mais eficientes de farmar Reputação',emoji:'🔹'},
                {label:'Farm de Recursos',value:'farmRecursosCetus',description:'Maneiras mais eficientes de farmar Foco',emoji:'🔸'},
                {label:'Pescaria & Mineração',value:'pescaria&MineracaoCetus',description:'Informações básicas sobre pescaria e mineração',emoji:'🔹'},
                {label:'Zaws - Armas Modulares',value:'zaws',description:'Guia dessas armas de corpo a corpo modulares',emoji:'🔸'},
                {label:'Eidolon',value:'eidolon',description:'Como matar o boss que spawna durante a noite?',emoji:'🔹'},
                {label:'Thusk Domas',value:'thuskDomas',description:'Mini boss que spawna durante o dia',emoji:'🔸'}
            ]),
        );
    
        m.channel.send({
            embeds:[{
                description:`**CETUS** é o primeiro mapa aberto que foi implementado ao game, chegando em 2017, deixou a comunidade muito empolgada. Nele vemos 5 moldes que se repetiram nos próximos mapas abertos lançados nos anos seguintes, são eles: \n\n- Mapa Aberto - **Planície de Eidolon**-  ( Local gigante onde o player faz as missões )\n- HUB de NPCS - **Cetus** - ( Local onde o player interage com os NPCs )\n- Área de Carregamento - **Local entre os 2 portões Brancos** -( Uma área de transferência entre o HUB de Npcs e o Mapa Aberto )\n- Jornada Inicial - **Jornada Vigília de Saya** - ( Jornada necessária para poder interagir com os NPCs)\n- Sindicato Princial - **Ostron** - ( Sindicato onde o player consegue reputação para trocar por itens com os NPCs )\n- Sindicato Secundário - **Os Plumas** - ( Sindicato Secreto onde o player consegue itens para seu Operador , AMPS & NECRAMECH )\n\nNesse guia iremos abordar como farmar cada recurso dessse mapa, como subir de rank com o sindicato dos NPCs de forma eficiente, qual a utilidade de cada NPC e outras dicas. Espero que goste, qualqer dúvida/erro ou sugestão ao guia, informar ao kenzouframe :D\n- Última Atualização desse guia ${time(new Date(),'R')} `,
                color: '14032414',
                image:{
                    url:'https://i.imgur.com/dSuUMy7.png'
                }
            }],
            files:[{
                attachment:"./src/embeds/attach/header_guiaCetus.png",
                name:'header_guiaCetus.png',
                description:'logo do guia'
            }],
            components: [guiaCetus]
            })
    } else if (m.content === "config.guiafortuna.channel"){   // MENU GUIA FORTUNA  
        if (!(m.channel.id === process.env.CHAT_GUIA_FORTUNA_ID)) return;
        const guiaFortuna =  new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('guiaFortuna')
            .setPlaceholder('Selecione um item')
            .setMaxValues(1)
            .setMinValues(1)
            .setOptions ([
                {label:'Npcs',value:'npcsDeFortuna',description:'Um breve resumo sobre o que cada NPC oferece',emoji:'🔸'},
                {label:'Farm de Reputação',value:'farmDeReputacaoFortuna',description:'Maneiras mais eficientes de farmar Reputação',emoji:'🔹'},
                {label:'Farm de Recursos',value:'farmRecursosFortuna',description:'Maneiras mais eficientes de farmar Foco',emoji:'🔸'},
                {label:'Pescaria & Mineração',value:'pescaria&MineracaoFortuna',description:'Informações básicas sobre pescaria e mineração',emoji:'🔹'},
                {label:'Kitguns - Armas Modulares',value:'kitguns',description:'Guia dessas armas secundárias modulares',emoji:'🔸'},
                {label:'Orb Beneficiária ( Profit Taker )',value:'orbBeneficiaria',description:'Como matar o boss?',emoji:'🔹'},
                {label:'Orb Usurpadora',value:'orbUsurpadora',description:'Como matar esse boss?',emoji:'🔸'},
                {label:'K-drive',value:'kdrive',description:'Como upar meu k-drive?',emoji:'🔹'},
                {label:'Eventos de Fortuna',value:'eventosDeFortuna',description:'Como fazer os eventos de Fortuna?',emoji:'🔸'}
            ]),
        );

        m.channel.send({
            embeds:[{
                description:`**FORTUNA** é o segundo mapa aberto que foi implementado ao game, chegando no final de 2018. Nele vemos 5 moldes que se repetiram desde Cetus e nos próximos mapas abertos lançados nos anos seguintes, são eles: \n\n- Mapa Aberto - **Orb Vallis**-  ( Local gigante onde o player faz as missões )\n- HUB de NPCS - **Fortuna** - ( Local onde o player interage com os NPCs )\n- Área de Carregamento - **Elevador** -( Uma área de transferência entre o HUB de Npcs e o Mapa Aberto )\n- Jornada Inicial - **Vox Solaris** - ( Jornada necessária para poder interagir com os NPCs)\n- Sindicato Princial - **Solaris United** - ( Sindicato onde o player consegue reputação para trocar por itens com os NPCs )\n- Sindicato Secundários - **Vox Solaris** - ( Sindicato Secreto onde o player consegue itens para seu Operador , AMPS & NECRAMECH )\n- Sindicato Secundários - **Ventkids** - ( Sindicato onde voce consegue upar seu Skate, k-Drive )\n\nNesse guia iremos abordar como farmar cada recurso dessse mapa, como subir de rank com o sindicato dos NPCs de forma eficiente, qual a utilidade de cada NPC e outras dicas. Espero que goste, qualqer dúvida/erro ou sugestão ao guia, informar ao kenzouframe :D\n- Última Atualização desse guia ${time(new Date(),'R')}`,
                image:{
                    url:"https://i.imgur.com/HGxa0xY.png"
                },
                color: '14032414',
            }],
            files:[{
                attachment:"./src/embeds/attach/header_guiaFortuna.png",
                name:'header_guiaFortuna.png',
                description:'logo do guia'
            }],
            components: [guiaFortuna]
            })
    } 

});
  
// SELECTMENU INTERACTIONS     -----------------------------------
client.on('interactionCreate', async (inte) => {
    if (!inte.isAnySelectMenu())return;

    if ((inte.customId === 'guiageralBasico')||(inte.customId === 'guiaGeralIntermediario')||(inte.customId === 'guiaGeralAvancado')){    // GUIA GERAL

    const selectChoice = inte.values[0];
    const fs = require('fs');
    const path = (`./src/embeds/guia/geral/${selectChoice}.json`);

    console.log(`📕 gerando item ${selectChoice} do guia ${inte.customId} para o membro ${inte.member.user.username} `)

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
        } else { inte.reply({content:'esse guia possui mais de 8 embeds ... ❌',ephemeral:'true'}).then(msg => setTimeout(() => msg.delete(), 6000))}
    } else { inte.reply({content:'essa interação ainda não está pronta ... 🙄',ephemeral:'true'}).then(msg => setTimeout(() => msg.delete(), 6000))}

    } else if ((inte.customId === 'guiaJornadasPrincipais')||(inte.customId === 'guiaJornadasSecundarias')){    // GUIA JORNADA
    
        const selectChoice = inte.values[0];
        const fs = require('fs');
        const path = (`./src/embeds/guia/jornadas/${selectChoice}.json`);

        console.log(`📕 gerando item ${selectChoice} do guia ${inte.customId} para o membro ${inte.member.user.username} `)

    if ((typeof(selectChoice) != 'undefined')&&(fs.existsSync(path))){

        const embed = (new EmbedBuilder(require(`../src/embeds/guia/jornadas/${selectChoice}.json`))).data ;
        const map = new Map(Object.entries(embed));

        let embedcount = 0
        for (let i=0;(i < map.size);i++){
            embedcount = i
        }

        if (embedcount === 0){
            inte.reply({embeds:[embed[0]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 180000));
        } else if (embedcount === 1){
            inte.reply({embeds:[embed[0],embed[1]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 180000));
        } else if (embedcount === 2){
            inte.reply({embeds:[embed[0],embed[1],embed[2]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 180000)); 
        } else if (embedcount === 3){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 180000)); 
        } else if (embedcount === 4){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 180000)); 
        } else if (embedcount === 5){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4],embed[5]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 180000)); 
        } else if (embedcount === 6){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4],embed[5],embed[6]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 180000)); 
        } else if (embedcount === 7){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4],embed[5],embed[6],embed[7]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 180000)); 
        } else if (embedcount === 8){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4],embed[5],embed[6],embed[7],embed[8]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 180000)); 
        } else { inte.reply({content:'esse guia possui mais de 8 embeds ... ❌',ephemeral:'true'}).then(msg => setTimeout(() => msg.delete(), 6000))}
    } else { inte.reply({content:'essa interação ainda não está pronta ... 🙄',ephemeral:'true'}).then(msg => setTimeout(() => msg.delete(), 6000))}

    // GUIA FARM
    } else if (inte.customId === 'guiaFarm'){    // GUIA FARM
    
        const selectChoice = inte.values[0];
        const fs = require('fs');
        const path = (`./src/embeds/guia/farm/${selectChoice}.json`);

        console.log(`📕 gerando item ${selectChoice} do guia ${inte.customId} para o membro ${inte.member.user.username} `)

    if ((typeof(selectChoice) != 'undefined')&&(fs.existsSync(path))){

        const embed = (new EmbedBuilder(require(`../src/embeds/guia/farm/${selectChoice}.json`))).data ;
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
        } else if (embedcount === 9){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4],embed[5],embed[6],embed[7],embed[8],embed[9]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 600000)); 
        } else { inte.reply({content:'esse guia possui mais de 9 embeds ... ❌',ephemeral:'true'}).then(msg => setTimeout(() => msg.delete(), 6000))}
    } else { inte.reply({content:'essa interação ainda não está pronta ... 🙄',ephemeral:'true'}).then(msg => setTimeout(() => msg.delete(), 6000))}

    } else if (inte.customId === 'guiaCetus'){    // GUIA CETUS
    
        const selectChoice = inte.values[0];
        const fs = require('fs');
        const path = (`./src/embeds/guia/cetus/${selectChoice}.json`);

        console.log(`📕 gerando item ${selectChoice} do guia ${inte.customId} para o membro ${inte.member.user.username} `)

    if ((typeof(selectChoice) != 'undefined')&&(fs.existsSync(path))){

        const embed = (new EmbedBuilder(require(`../src/embeds/guia/cetus/${selectChoice}.json`))).data ;
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
        } else if (embedcount === 9){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4],embed[5],embed[6],embed[7],embed[8],embed[9]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 600000)); 
        } else { inte.reply({content:'esse guia possui mais de 9 embeds ... ❌',ephemeral:'true'}).then(msg => setTimeout(() => msg.delete(), 6000))}
    } else { inte.reply({content:'essa interação ainda não está pronta ... 🙄',ephemeral:'true'}).then(msg => setTimeout(() => msg.delete(), 6000))}

    } else if (inte.customId === 'guiaFortuna'){    // GUIA FORTUNA
    
        const selectChoice = inte.values[0];
        const fs = require('fs');
        const path = (`./src/embeds/guia/fortuna/${selectChoice}.json`);

        console.log(`📕 gerando item ${selectChoice} do guia ${inte.customId} para o membro ${inte.member.user.username} `)

    if ((typeof(selectChoice) != 'undefined')&&(fs.existsSync(path))){

        const embed = (new EmbedBuilder(require(`../src/embeds/guia/fortuna/${selectChoice}.json`))).data ;
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
        } else if (embedcount === 9){
            inte.reply({embeds:[embed[0],embed[1],embed[2],embed[3],embed[4],embed[5],embed[6],embed[7],embed[8],embed[9]], ephemeral : true}).then(msg => setTimeout(() => msg.delete(), 600000)); 
        } else { inte.reply({content:'esse guia possui mais de 9 embeds ... ❌',ephemeral:'true'}).then(msg => setTimeout(() => msg.delete(), 6000))}
    } else { inte.reply({content:'essa guia ainda não está pronto ... 🙄',ephemeral:'true'}).then(msg => setTimeout(() => msg.delete(), 6000))}

    }    // GUIA ...
})