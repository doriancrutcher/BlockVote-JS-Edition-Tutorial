import {
  NearBindgen,
  near,
  call,
  view,
  LookupMap,
  UnorderedSet,
  UnorderedMap,
} from "near-sdk-js";

@NearBindgen({})
class VotingContract {
  // Candidate Pair Used to store Candidate Names and URL links
  candidatePair = new UnorderedMap<string[]>("candidate_pair");
  // Prompt Set Was used to in an effort to keep track of keys for the candidatePair Unordered Map
  promptSet = new UnorderedSet<string>("promptArray");
  voteArray = new UnorderedMap<number[]>("voteArray");
  userParticipation = new UnorderedMap<string[]>("user Participation ");

  // Writing View Methods

  @view({})
  getUrl({ prompt, name }: { prompt: string; name: string }): string {
    near.log(prompt);
    let candidateUrlArray = this.candidatePair.get(prompt);
    return candidateUrlArray[candidateUrlArray.indexOf(name) + 1];
  }

  @view({})
  didParticipate({ prompt, user }: { prompt: string; user: string }): boolean {
    let promptUserList: string[] = this.userParticipation.get(prompt, {
      defaultValue: [],
    });
    near.log(promptUserList);
    return promptUserList.includes(user);
  }

  @view({})
  participateArray({ prompt }: { prompt: string }): string[] {
    return this.userParticipation.get(prompt);
  }

  @view({})
  getAllPrompts(): string[] {
    return this.promptSet.toArray();
  }

  @view({})
  getVotes({ prompt }: { prompt: string }): number[] {
    return this.voteArray.get(prompt, { defaultValue: [] });
  }

  @view({})
  getCandidatePair({ prompt }: { prompt: string }): string[] {
    let candidateUrlArray = this.candidatePair.get(prompt, {
      defaultValue: ["n/a,n/a"],
    });
    return [candidateUrlArray[0], candidateUrlArray[2]];
  }

  @call({})
  addCandidatePair({
    prompt,
    name1,
    name2,
    url1,
    url2,
  }: {
    prompt: string;
    name1: string;
    name2: string;
    url1: string;
    url2: string;
  }) {
    this.candidatePair.set(prompt, [name1, url1, name2, url2]);
  }

  @call({})
  initializeVotes({ prompt }: { prompt: string }) {
    this.voteArray.set(prompt, [0, 0]);
  }

  @call({})
  addToPromptArray({ prompt }: { prompt: string }) {
    this.promptSet.set(prompt);
  }

  @call({})
  clearPromptArray() {
    this.promptSet.clear();
    this.candidatePair.clear();
    this.userParticipation.clear();
    this.voteArray.clear();
    near.log("clearing polls");
  }

  @call({})
  addVote({ prompt, index }: { prompt: string; index: number }) {
    let currentVotes = this.voteArray.get(prompt, { defaultValue: [0, 0] });
    currentVotes[index] = currentVotes[index] + 1;
    this.voteArray.set(prompt, currentVotes);
  }

  @call({})
  recordUser({ prompt, user }: { prompt: string; user: string }) {
    let currentArray = this.userParticipation.get(prompt, { defaultValue: [] });
    currentArray.includes(user) ? null : currentArray.push(user);
    this.userParticipation.set(prompt, currentArray);
  }
}
