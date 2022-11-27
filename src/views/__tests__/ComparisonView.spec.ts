import { describe, it, expect, vi } from "vitest";

import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import ComparisonView from "../ComparisonView.vue";

describe("ComparisonView", () => {
  it("renders properly", () => {
    const wrapper = mount(ComparisonView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              comparison: { candidates: ["one", "two"] },
            },
          }),
        ],
      },
    });
    expect(wrapper.text()).toContain("one");
    expect(wrapper.text()).toContain("two");
  });
});
