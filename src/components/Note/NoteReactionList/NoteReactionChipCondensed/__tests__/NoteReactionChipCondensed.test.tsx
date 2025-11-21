import {render} from "testUtils";
import {fireEvent} from "@testing-library/react";
import {NoteReactionChipCondensed} from "../NoteReactionChipCondensed";
import {REACTION_EMOJI_MAP} from "store/features/reactions/types";

const createMockParticipant = (id: string, name: string) => ({
  id,
  name,
  user: id,
  connected: true,
  ready: true,
  raisedHand: false,
  showHiddenColumns: false,
  role: "PARTICIPANT",
});

describe("NoteReactionChipCondensed", () => {
  it("should render correct number of reaction emojis", () => {
    const mockReactions = [
      {
        noteId: "test-note-id",
        reactionType: "like" as const,
        amount: 2,
        users: [createMockParticipant("user1", "User1"), createMockParticipant("user2", "User2")],
        myReactionId: null,
      },
      {
        noteId: "test-note-id",
        reactionType: "heart" as const,
        amount: 1,
        users: [createMockParticipant("user3", "User3")],
        myReactionId: null,
      },
    ];

    const {container} = render(<NoteReactionChipCondensed reactions={mockReactions} handleLongPressReaction={jest.fn()} />);

    const reactionContainer = container.getElementsByClassName("note-reaction-chip-condensed__reactions-container")[0];

    expect(reactionContainer.children.length).toBe(2);
  });

  it("should filter out user's own reactions", () => {
    const mockReactions = [
      {
        noteId: "test-note-id",
        reactionType: "like" as const,
        amount: 2,
        users: [createMockParticipant("user1", "User1")],
        myReactionId: "own-reaction-1",
      },
      {
        noteId: "test-note-id",
        reactionType: "heart" as const,
        amount: 1,
        users: [createMockParticipant("user2", "User2")],
        myReactionId: null,
      },
    ];

    const {container} = render(<NoteReactionChipCondensed reactions={mockReactions} handleLongPressReaction={jest.fn()} />);

    const amountElement = container.getElementsByClassName("note-reaction-chip-condensed__amount")[0];

    expect(amountElement.textContent).toBe("1");

    const reactionContainer = container.getElementsByClassName("note-reaction-chip-condensed__reactions-container")[0];

    expect(reactionContainer.children.length).toBe(1);
  });

  it("should handle reactions with skin-tone supported emojis", () => {
    const mockReactions = [
      {
        noteId: "test-note-id",
        reactionType: "like" as const,
        amount: 2,
        users: [createMockParticipant("user1", "User1")],
        myReactionId: null,
      },
      {
        noteId: "test-note-id",
        reactionType: "dislike" as const,
        amount: 1,
        users: [createMockParticipant("user2", "User2")],
        myReactionId: null,
      },
    ];

    const {container} = render(<NoteReactionChipCondensed reactions={mockReactions} handleLongPressReaction={jest.fn()} />);

    const reactionContainer = container.getElementsByClassName("note-reaction-chip-condensed__reactions-container")[0];

    expect(reactionContainer.children.length).toBe(2);

    const likeEmoji = REACTION_EMOJI_MAP.get("like")!.emoji;
    const dislikeEmoji = REACTION_EMOJI_MAP.get("dislike")!.emoji;

    expect(container.innerHTML).toContain(likeEmoji);
    expect(container.innerHTML).toContain(dislikeEmoji);
  });

  it("should call handleLongPressReaction on long press", () => {
    jest.useFakeTimers();

    const mockHandleLongPress = jest.fn();
    const mockReactions = [
      {
        noteId: "test-note-id",
        reactionType: "like" as const,
        amount: 2,
        users: [createMockParticipant("user1", "User1")],
        myReactionId: null,
      },
    ];

    const {container} = render(<NoteReactionChipCondensed reactions={mockReactions} handleLongPressReaction={mockHandleLongPress} />);

    const rootElement = container.getElementsByClassName("note-reaction-chip-condensed__root")[0];

    fireEvent.pointerDown(rootElement);
    jest.advanceTimersByTime(500);
    fireEvent.pointerUp(rootElement);

    expect(mockHandleLongPress).toHaveBeenCalledTimes(1);

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should stop touch event propagation", () => {
    const mockReactions = [
      {
        noteId: "test-note-id",
        reactionType: "like" as const,
        amount: 2,
        users: [createMockParticipant("user1", "User1")],
        myReactionId: null,
      },
    ];

    const {container} = render(<NoteReactionChipCondensed reactions={mockReactions} handleLongPressReaction={jest.fn()} />);

    const rootElement = container.getElementsByClassName("note-reaction-chip-condensed__root")[0];

    const stopPropagation = jest.fn();
    const event = new Event("touchstart", {bubbles: true});

    (event as any).stopPropagation = stopPropagation;

    rootElement.dispatchEvent(event);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
  });
});
