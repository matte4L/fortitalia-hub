// DATI DELLE NOTIZIE - MODIFICA QUI PER AGGIUNGERE/CAMBIARE NOTIZIE
const newsData = [
    {
        title: "Nuova Stagione Fortnite: Tutto quello che devi sapere",
        excerpt: "La nuova stagione di Fortnite porta tante novità per i giocatori competitivi italiani. Scopri le nuove meccaniche e strategie per dominare in questa season.",
        content: "La nuova stagione di Fortnite ha finalmente fatto il suo debutto, portando con sé una serie di innovazioni che rivoluzioneranno il panorama competitivo italiano. Dalle nuove armi ai cambiamenti della mappa, ogni aspetto è stato pensato per offrire un'esperienza di gioco più equilibrata e coinvolgente.\n\nTra le novità più significative troviamo il nuovo sistema di mobilità che permette ai giocatori di spostarsi più rapidamente attraverso la mappa, aprendo nuove possibilità strategiche per i team competitivi. Inoltre, l'introduzione di nuove meccaniche di costruzione cambierà radicalmente l'approccio tattico dei pro player.\n\nI migliori team italiani hanno già iniziato ad adattare le loro strategie, e i primi risultati sono promettenti. Questa stagione potrebbe essere quella della consacrazione definitiva dell'Italia nel panorama internazionale di Fortnite.",
        date: "2 giorni fa",
        category: "Aggiornamenti",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop"
    },
    {
        title: "Team italiano vince il campionato europeo",
        excerpt: "Un incredibile successo per l'Italia nel panorama competitivo di Fortnite. Il team 'Gladiatori' conquista il primo posto nel torneo europeo.",
        content: "Una giornata storica per l'esport italiano! Il team 'Gladiatori' ha conquistato il primo posto nel prestigioso campionato europeo di Fortnite, battendo squadre di altissimo livello provenienti da tutta Europa.\n\nLa finale è stata particolarmente emozionante, con i Gladiatori che hanno dimostrato una strategia impeccabile e una coordinazione perfetta. Il trio composto da Marco 'ItalianStorm' Rossi, Alessandro 'VictoryRoyale' Bianchi e Luca 'BuildMaster' Verdi ha dominato le ultime tre partite consecutive, assicurandosi la vittoria con un margine impressionante.\n\nQuesto successo rappresenta un momento di svolta per l'Italia nel panorama competitivo internazionale di Fortnite. Il premio in palio di 50.000€ verrà reinvestito dal team per migliorare ulteriormente le proprie performance e partecipare ai tornei mondiali.",
        date: "1 settimana fa",
        category: "Competitivo",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop"
    },
    {
        title: "Guida alle migliori strategie per la Season 5",
        excerpt: "I pro player italiani condividono i loro segreti per dominare nella nuova stagione. Tattiche avanzate e consigli esclusivi dalla community.",
        content: "I migliori pro player italiani hanno unito le forze per creare la guida strategica definitiva per la Season 5 di Fortnite. Dopo settimane di analisi e testing, ecco i segreti che ti permetteranno di dominare questa stagione.\n\n**Landing Spots Ottimali:**\nLa nuova mappa ha introdotto zone di loot riviste che cambiano completamente le dinamiche di atterraggio. I spot più redditizi sono ora concentrati nella zona nord-est, dove è possibile ottenere equipaggiamento di livello leggendario con minor rischio.\n\n**Rotazioni Vincenti:**\nLe nuove meccaniche di movimento richiedono un approccio completamente diverso alle rotazioni. Il timing è tutto: muoversi troppo presto espone a third party, troppo tardi significa rimanere intrappolati nella storm.\n\n**Build Fighting 2.0:**\nLe modifiche alle costruzioni hanno reso obsolete molte tecniche classiche. I nuovi meta builds si concentrano su strutture più compatte ma più resistenti, privilegiando l'efficienza dei materiali rispetto alla velocità pura.",
        date: "2 settimane fa",
        category: "Guide",
        image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=200&fit=crop"
    }
];

// DATI DEI TORNEI - MODIFICA QUI PER AGGIUNGERE/CAMBIARE TORNEI
const tournamentData = [
    {
        name: "Coppa Italia Fortnite 2024",
        date: "15 Gen 2024",
        time: "18:00 CET",
        prizePool: "€10.000",
        participants: "256/256",
        status: "upcoming",
        registrationUrl: "#"
    },
    {
        name: "Weekly Italian Cup #47",
        date: "Oggi",
        time: "20:00 CET",
        prizePool: "€500",
        participants: "128/128",
        status: "live",
        liveUrl: "https://www.twitch.tv/fortnite"
    },
    {
        name: "Pro Scrim Tournament",
        date: "20 Gen 2024",
        time: "19:00 CET",
        prizePool: "€2.000",
        participants: "64/64",
        status: "upcoming",
        registrationUrl: "#"
    },
    {
        name: "Italian Championship Finals",
        date: "8 Gen 2024", 
        time: "17:00 CET",
        prizePool: "€25.000",
        participants: "32/32",
        status: "completed"
    }
];

// Funzione per creare una card notizia
function createNewsCard(news, index) {
    return `
        <div class="news-card" onclick="openNewsModal(${index})">
            <img src="${news.image}" alt="${news.title}" loading="lazy">
            <div class="news-card-content">
                <div class="news-card-header">
                    <span class="news-badge">${news.category}</span>
                    <span class="news-date">${news.date}</span>
                </div>
                <h3>${news.title}</h3>
                <p>${news.excerpt}</p>
            </div>
        </div>
    `;
}

// Funzione per creare una card torneo
function createTournamentCard(tournament) {
    const statusClass = `status-${tournament.status}`;
    const statusText = tournament.status === 'live' ? 'LIVE' : 
                     tournament.status === 'upcoming' ? 'PROSSIMO' : 'COMPLETATO';
    
    let actionButton = '';
    if (tournament.status === 'upcoming' && tournament.registrationUrl) {
        actionButton = `<button class="btn-primary glow" onclick="window.open('${tournament.registrationUrl}', '_blank')">Registrati Ora</button>`;
    } else if (tournament.status === 'live') {
        actionButton = `<button class="btn-secondary" onclick="window.open('${tournament.liveUrl || 'https://www.twitch.tv/fortnite'}', '_blank')" style="background: var(--italian-red); color: white;">Guarda Live</button>`;
    }

    return `
        <div class="tournament-card">
            <div class="tournament-header">
                <span class="tournament-status ${statusClass}">${statusText}</span>
                <div class="tournament-date">
                    <div>${tournament.date}</div>
                    <div>${tournament.time}</div>
                </div>
            </div>
            <h3>${tournament.name}</h3>
            <div class="tournament-info">
                <div>
                    <div class="label">Premio:</div>
                    <div class="value prize">${tournament.prizePool}</div>
                </div>
                <div>
                    <div class="label">Partecipanti:</div>
                    <div class="value">${tournament.participants}</div>
                </div>
            </div>
            ${actionButton}
        </div>
    `;
}

// Funzione per smooth scroll
function smoothScroll(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Inizializzazione quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function() {
    // Carica le notizie
    const newsContainer = document.getElementById('newsContainer');
    if (newsContainer) {
        newsContainer.innerHTML = newsData.map((news, index) => createNewsCard(news, index)).join('');
    }

    // Carica i tornei
    const tournamentsContainer = document.getElementById('tournamentsContainer');
    if (tournamentsContainer) {
        tournamentsContainer.innerHTML = tournamentData.map(createTournamentCard).join('');
    }

    // Aggiungi event listener per la navigazione smooth
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScroll(targetId);
        });
    });
});

// FUNZIONI MODAL NOTIZIE
function openNewsModal(index) {
    const news = newsData[index];
    const modal = document.getElementById('newsModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDate = document.getElementById('modalDate');
    const modalImage = document.getElementById('modalImage');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = news.title;
    modalCategory.textContent = news.category;
    modalDate.textContent = news.date;
    modalImage.src = news.image;
    modalImage.alt = news.title;
    modalContent.innerHTML = news.content.replace(/\n/g, '<br><br>');
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeNewsModal() {
    const modal = document.getElementById('newsModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// FUNZIONI PER AGGIUNGERE CONTENUTI - USA QUESTE PER MODIFICARE IL SITO

// Aggiungi una nuova notizia
function addNews(title, excerpt, date, category, image = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop") {
    const newNews = { title, excerpt, date, category, image };
    newsData.unshift(newNews); // Aggiunge in cima
    
    // Ricarica le notizie
    const newsContainer = document.getElementById('newsContainer');
    if (newsContainer) {
        newsContainer.innerHTML = newsData.map((news, index) => createNewsCard(news, index)).join('');
    }
}

// Aggiungi un nuovo torneo
function addTournament(name, date, time, prizePool, participants, status, registrationUrl = "#") {
    const newTournament = { name, date, time, prizePool, participants, status, registrationUrl };
    tournamentData.unshift(newTournament); // Aggiunge in cima
    
    // Ricarica i tornei
    const tournamentsContainer = document.getElementById('tournamentsContainer');
    if (tournamentsContainer) {
        tournamentsContainer.innerHTML = tournamentData.map(createTournamentCard).join('');
    }
}

// ESEMPI DI USO:
// addNews("Titolo notizia", "Descrizione della notizia...", "Oggi", "Categoria");
// addTournament("Nome Torneo", "25 Gen 2024", "19:00", "€1000", "64/128", "upcoming", "https://link-registrazione.com");