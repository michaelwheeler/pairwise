import { describe, it, expect, vi } from "vitest";

import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import HomeView from "../HomeView.vue";

describe("HomeView", () => {
  it("renders properly", () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              comparison: { candidates: ["one", "two", "three"] },
            },
          }),
        ],
      },
    });
    expect(wrapper.text()).toContain("Add");
    expect(wrapper.text()).toContain("one");
    expect(wrapper.text()).toContain("two");
    expect(wrapper.text()).toContain("three");
  });
});
