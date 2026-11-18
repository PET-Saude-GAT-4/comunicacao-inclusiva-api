# Glossary

The project's single glossary, shared by the API, the dashboard and the app. Code, docs and issues are written in English; the interfaces are in Portuguese. This table maps one to the other. The dashboard and app docs link here instead of keeping their own.

| Term (code and docs) | In the UI | Meaning |
|---|---|---|
| **Pictogram** | Pictograma | An image that stands for a word or idea. Stored as a file with a description (`Pictogram`). |
| **SignWriting** | SignWriting (escrita de sinais) | A written notation of a sign in Libras, stored as an image with a description (`SignWriting`). |
| **Term** | Termo | The unit of communication: one pictogram paired with one SignWriting (`Term`). The same pair exists only once. |
| **Board** | Prancha | An ordered set of terms on one theme, shown to the patient to point at (`Board`). Has a representative pictogram and becomes visible in the app when published. |
| **Common board** | Prancha do tipo "Comum" | A board for everyday communication (`BoardType.common`). |
| **Emergency board** | Prancha do tipo "Emergência" | A board meant for urgent situations (`BoardType.emergency`). Only these can be triage steps. |
| **Phrase** | Frase | A ready-made sentence built from an ordered list of terms (`Phrase`). Can be listed in the app's library or kept unlisted just to trigger recommendations. |
| **Interaction chain** | Cadeia de interação | A recommendation: after a given board or phrase, suggest a response board, in ranked order (`InteractionChain`). The app shows these as the next boards. |
| **Triage step** | Nível de triagem | One of the five fixed Quick Emergency levels (1 to 5), each holding one emergency board (`TriageStep`). |
| **Profession** | Profissão | The health professional's occupation, chosen in the app before a consultation (`Profession`). |
| **Speciality** | Especialidade | A subdivision of a profession (`Speciality`). The app offers a default "Geral" when a profession has none. |
| **Published** | Publicada | Content with `publishedAt` set, visible through the `/public` routes. Unpublished content exists only in the dashboard. |
| **Role** | Cargo | What a user may do: `super_admin`, `admin` or `viewer`. See [AUTH.md](AUTH.md). |
| **Invitation** | Convite | The emailed link through which a new user confirms the account and sets a password. |
