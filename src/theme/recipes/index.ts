import { buttonRecipe } from './button.recipe';
import { checkboxRecipe } from './checkbox.recipe';
import { dropdownRecipe } from './dropdown.recipe';
import { fileUploadRecipe } from './file-upload.recipe';
import { paginationRecipe } from './pagination.recipe';
import { phoneInputRecipe } from './phone-input.recipe';
import { phoneInputDropdownRecipe } from './phone-input-dropdown.recipe';
import { reviewRecipe } from './review.recipe';
import { searchInputRecipe } from './search-input.recipe';
import { tableRecipe } from './table.recipe';
import { tabsRecipe } from './tabs.recipe';
import { tagRecipe } from './tag.recipe';
import { textInputRecipe } from './text-input.recipe';
import { tooltipRecipe } from './tooltip.recipe';

export const recipes = {
  button: buttonRecipe,
  checkbox: checkboxRecipe,
  dropdown: dropdownRecipe,
  phoneInput: phoneInputRecipe,
  phoneInputDropdown: phoneInputDropdownRecipe,
  review: reviewRecipe,
  searchInput: searchInputRecipe,
  tabs: tabsRecipe,
  tag: tagRecipe,
  textInput: textInputRecipe,
  tooltip: tooltipRecipe
};

export const slotRecipes = {
  fileUpload: fileUploadRecipe,
  pagination: paginationRecipe,
  table: tableRecipe
};
