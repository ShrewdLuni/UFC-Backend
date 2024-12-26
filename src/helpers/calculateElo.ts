import { EloRatingCalculator } from "../engine/engine";
import { serializeFightForEloCalculation, serializeFightWithID } from "../serializers/fight";
import { getAllFightsWithEventDates, getFights } from "../services/fight";
import { createElo, getLatestEloByFighterId } from "../services/elo";
import { serializeElo } from "../serializers/elo";
import { DatabaseElo } from "../types/databaseTypes";

const calculateElo = async () => {
  const eloEngine = new EloRatingCalculator(200)
  const fights = (await getAllFightsWithEventDates()).map(serializeFightForEloCalculation)
  for(const fight of fights) {
    let rawRatingA = await getLatestEloByFighterId(fight.fighterOneId)
    let rawRatingB = await getLatestEloByFighterId(fight.fighterTwoId)

    if(!rawRatingA){
      rawRatingA = await createElo({
        fighterId: fight.fighterOneId,
        type: eloEngine.getRatingType(),
        weightClass: fight.weightClass,
        date: fight.date,
        value: eloEngine.getInitialRating(),
      })
    }

    if(!rawRatingB){
      rawRatingB = await createElo({
        fighterId: fight.fighterTwoId,
        type: eloEngine.getRatingType(),
        weightClass: fight.weightClass,
        date: fight.date,
        value: eloEngine.getInitialRating(),
      })
    }

    const ratingA = serializeElo(rawRatingA)
    const ratingB = serializeElo(rawRatingB)

    const isKo: boolean = fight.methodName == "KO/TKO" || fight.methodName == "SUB"
    const delta = eloEngine.calculateRatingDelta(ratingA.value, ratingB.value, isKo)
    ratingA.value = ratingA.value + delta;
    ratingA.date = fight.date

    ratingB.value = ratingB.value - delta;
    ratingB.date = fight.date

    await createElo(ratingA)
    await createElo(ratingB)
  }
}

calculateElo();
