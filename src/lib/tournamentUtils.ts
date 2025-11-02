export interface Tournament {
  id: string;
  name: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  duration: number; // durata in minuti
  prizePool: string;
  registrationUrl?: string;
  liveUrl?: string;
}

export type TournamentStatus = "upcoming" | "live" | "completed";

// Funzione per calcolare lo stato del torneo
export const getTournamentStatus = (tournament: Tournament): TournamentStatus => {
  const now = new Date();
  const tournamentDateTime = new Date(`${tournament.date}T${tournament.time}`);
  const tournamentEnd = new Date(tournamentDateTime.getTime() + tournament.duration * 60000);

  if (now < tournamentDateTime) {
    return "upcoming";
  } else if (now >= tournamentDateTime && now < tournamentEnd) {
    return "live";
  } else {
    return "completed";
  }
};

// Formatta la data in italiano
export const formatTournamentDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
