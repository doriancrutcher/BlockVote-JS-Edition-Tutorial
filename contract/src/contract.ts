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
class HelloNear {
  greeting: string = "Hello";

  candidatePair = new UnorderedMap<string[]>("candidate_pair");
  promptSet = new UnorderedSet<string>("promptArray");
  voteArray = new UnorderedMap<number[]>("voteArray");
  userParticipation = new UnorderedMap<string[]>("user Participation ");

  // Writing View Methods

  @view({})
  getUrl({ prompt, name }: { prompt: string; name: string }): string {
    let candidateUrlArray = this.candidatePair.get(prompt);
    return candidateUrlArray[candidateUrlArray.indexOf(name) + 1];
  }

  @view({})
  didParticipate({ prompt, user }: { prompt: string; user: string }): boolean {
    let promptUserList: string[] = this.userParticipation.get(prompt, {
      defaultValue: [],
    });

    return promptUserList.includes(user);
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

  // change methods
  @call({}) // This method changes the state, for which it cost gas
  set_greeting({ message }: { message: string }): void {
    // Record a log permanently to the blockchain!
    near.log(`Saving greeting ${message}`);
    this.greeting = message;
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
  newVote({ prompt }: { prompt: string }) {
    this.voteArray.set(prompt, [0, 0]);
  }

  @call({})
  addToPromptArray({ prompt }: { prompt: string }) {
    this.promptSet.set(prompt);
  }

  @call({})
  clearPromptArray() {
    this.promptSet.clear();
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
    if (!currentArray.includes(user)) {
      currentArray.push(user);
    }
  }
}
