import { getAvailabilityStatus, type AvailabilityStatus } from "@/lib/availability";

/**
 * Resolves a MenuItem's option groups/options into display-ready view models
 * (pre-sorted, pre-filtered, with availability computed). No Firestore access here.
 */

export type MenuOptionViewModel = Omit<ItemOption, "availability"> & {
  availability: AvailabilityStatus;
};

export type MenuOptionGroupViewModel = {
  group: OptionGroup;
  options: MenuOptionViewModel[];
};

export type MenuItemViewModel = {
  item: MenuItem;
  availability: AvailabilityStatus;
  optionGroups: MenuOptionGroupViewModel[];
};

export function buildMenuItemViewModel(
  item: MenuItem,
  optionGroupsById: Map<string, OptionGroup>,
  optionsById: Map<string, ItemOption>,
  timezone: string,
  now: Date = new Date(),
): MenuItemViewModel {
  // item.optionGroupIds is already normalized + sorted by order ascending, see lib/orderMenuData.ts
  const optionGroups = (item.optionGroupIds ?? [])
    .map(({ optionGroupId }) => optionGroupsById.get(optionGroupId))
    .filter((group): group is OptionGroup => group != null)
    .map((group) => ({
      group,
      options: (group.optionIds ?? [])
        .map((id) => optionsById.get(id))
        .filter((option): option is ItemOption => option != null)
        .map((option) => ({
          ...option,
          availability: getAvailabilityStatus(option, timezone, now),
        })),
    }));

  return {
    item,
    availability: getAvailabilityStatus(item, timezone, now),
    optionGroups,
  };
}

/** "Choose 1", "Choose up to 3", "Choose 1-3", "Optional" — a short selection-rule label for a group. */
export function selectionRuleLabel(group: OptionGroup): string {
  if (group.maxSelection <= 1) {
    return group.minSelection >= 1 ? "Choose 1" : "Optional";
  }
  return group.minSelection >= 1
    ? `Choose ${group.minSelection}-${group.maxSelection}`
    : `Choose up to ${group.maxSelection}`;
}
