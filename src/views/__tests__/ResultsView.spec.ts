import { describe, it, expect, vi } from "vitest";

import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import ResultsView from "../ResultsView.vue";

describe("ResultsView", () => {
  it("renders properly", () => {
    const wrapper = mount(ResultsView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              comparison: {
                candidates: ["one", "two", "three"],
                votes: [
                  ["one", "two"],
                  ["one", "three"],
                  ["two", "three"],
                ],
              },
            },
          }),
        ],
      },
    });
    expect(wrapper.text()).toContain("onetwothree");
  });
});
