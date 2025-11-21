// import { render } from "testUtils";
// import { fireEvent } from "@testing-library/react";
// import { NoteReactionPopup } from "../NoteReactionPopup";
// import { ReactionType } from "store/features/reactions/types";

// // Ensure the Portal target exists in jsdom
// beforeAll(() => {
//     if (!document.getElementById("portal")) {
//         const portalRoot = document.createElement("div");
//         portalRoot.id = "portal";
//         document.body.appendChild(portalRoot);
//     }
// });

// const createMockUser = (id: string, name: string) => ({
//     id,
//     name,
//     user: { id },
//     connected: true,
//     ready: true,
//     raisedHand: false,
//     showHiddenColumns: false,
//     role: "PARTICIPANT",
// });

// const createReaction = (overrides?: Partial<any>) => ({
//     noteId: "test-note-id",
//     reactionType: "like" as ReactionType,
//     amount: 1,
//     users: [createMockUser("user1", "User 1")],
//     myReactionId: null,
//     ...overrides,
// });

// describe("NoteReactionPopup", () => {
//     it("should render total reactions count in the 'all' tab", () => {
//         const reactionsFlat = [
//             createReaction({ reactionType: "like" as ReactionType, amount: 2 }),
//             createReaction({ reactionType: "heart" as ReactionType, amount: 3 }),
//         ];

//         const reactionsReduced = [
//             createReaction({ reactionType: "like" as ReactionType, amount: 2 }),
//             createReaction({ reactionType: "heart" as ReactionType, amount: 3 }),
//         ];

//         render(
//             <NoteReactionPopup
//                 reactionsFlat={reactionsFlat}
//                 reactionsReduced={reactionsReduced}
//                 onClose={jest.fn()}
//             />,
//         );

//         const amountElement = document.getElementsByClassName(
//             "note-reaction-popup__tab--amount",
//         )[0] as HTMLElement | undefined;

//         expect(amountElement).toBeTruthy();
//         // 2 + 3 = 5
//         expect(amountElement!.textContent).toBe("5");
//     });

//     it("should render all reactions in the 'all' container", () => {
//         const reactionsFlat = [
//             createReaction({ reactionType: "like" as ReactionType }),
//             createReaction({ reactionType: "like" as ReactionType }),
//             createReaction({ reactionType: "heart" as ReactionType }),
//         ];

//         const reactionsReduced = [
//             createReaction({ reactionType: "like" as ReactionType, amount: 2 }),
//             createReaction({ reactionType: "heart" as ReactionType, amount: 1 }),
//         ];

//         render(
//             <NoteReactionPopup
//                 reactionsFlat={reactionsFlat}
//                 reactionsReduced={reactionsReduced}
//                 onClose={jest.fn()}
//             />,
//         );

//         const containers = document.getElementsByClassName(
//             "note-reaction-popup__container",
//         );

//         expect(containers.length).toBeGreaterThanOrEqual(1);

//         // first container = "all reactions"
//         const allContainer = containers[0] as HTMLElement;
//         const rows = allContainer.getElementsByClassName(
//             "note-reaction-popup__row-container",
//         );

//         expect(rows.length).toBe(reactionsFlat.length);
//     });

//     it("should render filtered reactions in type-specific containers", () => {
//         const reactionsFlat = [
//             createReaction({
//                 reactionType: "like" as ReactionType,
//                 users: [createMockUser("user1", "User 1")],
//             }),
//             createReaction({
//                 reactionType: "like" as ReactionType,
//                 users: [createMockUser("user2", "User 2")],
//             }),
//             createReaction({
//                 reactionType: "heart" as ReactionType,
//                 users: [createMockUser("user3", "User 3")],
//             }),
//         ];

//         const reactionsReduced = [
//             createReaction({ reactionType: "like" as ReactionType, amount: 2 }),
//             createReaction({ reactionType: "heart" as ReactionType, amount: 1 }),
//         ];

//         render(
//             <NoteReactionPopup
//                 reactionsFlat={reactionsFlat}
//                 reactionsReduced={reactionsReduced}
//                 onClose={jest.fn()}
//             />,
//         );

//         const containers = document.getElementsByClassName(
//             "note-reaction-popup__container",
//         );

//         // 1 "all" container + 2 type-specific containers
//         expect(containers.length).toBeGreaterThanOrEqual(3);

//         // containers[0] = all, [1] = like, [2] = heart
//         const likeContainer = containers[1] as HTMLElement;
//         const heartContainer = containers[2] as HTMLElement;

//         const likeRows = likeContainer.getElementsByClassName(
//             "note-reaction-popup__row-container",
//         );
//         const heartRows = heartContainer.getElementsByClassName(
//             "note-reaction-popup__row-container",
//         );

//         expect(likeRows.length).toBe(2);
//         expect(heartRows.length).toBe(1);
//     });

//     it("should call onClose when there are no reactions", () => {
//         const mockOnClose = jest.fn();

//         render(
//             <NoteReactionPopup
//                 reactionsFlat={[]}
//                 reactionsReduced={[]}
//                 onClose={mockOnClose}
//             />,
//         );

//         // useEffect should trigger immediately because totalReactions === 0
//         expect(mockOnClose).toHaveBeenCalledTimes(1);
//     });

//     it("should scroll containers when 'all' tab is clicked", () => {
//         const reactionsFlat = [
//             createReaction({ reactionType: "like" as ReactionType }),
//             createReaction({ reactionType: "heart" as ReactionType }),
//         ];

//         const reactionsReduced = [
//             createReaction({ reactionType: "like" as ReactionType, amount: 1 }),
//             createReaction({ reactionType: "heart" as ReactionType, amount: 1 }),
//         ];

//         render(
//             <NoteReactionPopup
//                 reactionsFlat={reactionsFlat}
//                 reactionsReduced={reactionsReduced}
//                 onClose={jest.fn()}
//             />,
//         );

//         const main = document.getElementsByClassName(
//             "note-reaction-popup__main",
//         )[0] as HTMLDivElement | undefined;

//         expect(main).toBeTruthy();

//         // mock width and scrollTo on the portal-rendered main element
//         Object.defineProperty(main!, "offsetWidth", {
//             value: 200,
//             configurable: true,
//         });

//         const scrollTo = jest.fn();
//         (main as any).scrollTo = scrollTo;

//         const allTab = document.getElementsByClassName(
//             "note-reaction-popup__tab-all",
//         )[0] as HTMLButtonElement | undefined;

//         expect(allTab).toBeTruthy();

//         fireEvent.click(allTab!);

//         expect(scrollTo).toHaveBeenCalledTimes(1);
//         expect(scrollTo).toHaveBeenCalledWith({
//             left: 0,
//             behavior: "smooth",
//         });
//     });
// });
