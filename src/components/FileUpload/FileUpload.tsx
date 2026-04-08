import { forwardRef, useId, useMemo, useRef, useState } from 'react';
import type {
  ChangeEvent,
  DragEvent,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent
} from 'react';
import { Box, Spinner, useSlotRecipe } from '@chakra-ui/react';
import type { HTMLChakraProps } from '@chakra-ui/react';
import { fileUploadRecipe } from '../../theme/recipes/file-upload.recipe';
import {
  BinIcon,
  CheckmarkFilledIcon,
  CloseIcon,
  ErrorExclamationIcon,
  FolderFileIcon,
  FolderUploadIcon
} from '../../assets/icons';

export type FileUploadFileStatus = 'idle' | 'uploading' | 'success' | 'error';

export type FileUploadVariant = 'dropZone' | 'button' | 'input';

export interface FileUploadFile {
  id: string;
  name: string;
  size?: number;
  status: FileUploadFileStatus;
  progress?: number;
  errorMessage?: string;
  previewUrl?: string;
}

export interface FileUploadProps extends Omit<
  HTMLChakraProps<'div'>,
  'onChange'
> {
  /** Visual variant: dropZone (drag & drop area), button (compact upload button), or input (text input style) */
  variant?: FileUploadVariant;
  /** Placeholder text for input variant */
  placeholder?: string;
  /** Label text for input variant */
  label?: string;
  /** Label subtext for input variant */
  labelSubtext?: string;
  /** Supporting text shown below input */
  supportingText?: string;
  /** Show required indicator (*) */
  required?: boolean;
  /** Show optional indicator */
  showOptional?: boolean;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Accepted file types (MIME types or extensions) */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Description lines for drop zone */
  description?: string[];
  /** Button label for button variant */
  buttonLabel?: string;
  /** Controlled files array */
  files?: FileUploadFile[];
  /** Selected file for button variant (single file mode) */
  selectedFile?: FileUploadFile | null;
  /** Callback when files change */
  onChange?: (files: FileUploadFile[]) => void;
  /** Callback when file is removed */
  onRemove?: (file: FileUploadFile) => void;
  /** Callback when files are dropped/selected */
  onFilesSelected?: (files: File[]) => void;
  /** Global error message */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
}

type FileStatusSlotStyles =
  ReturnType<ReturnType<typeof useSlotRecipe>> extends (
    options?: infer Options
  ) => infer Styles
    ? { options: Options; styles: Styles }
    : never;

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      variant = 'dropZone',
      accept,
      multiple = true,
      description = ['Max file size: 10 MB', 'Supported formats: csv, xls'],
      buttonLabel = 'Upload File',
      placeholder = 'Select File(s)',
      label,
      labelSubtext,
      supportingText,
      required = false,
      showOptional = false,
      files = [],
      selectedFile,
      onChange,
      onRemove,
      onFilesSelected,
      error,
      disabled = false,
      ...restProps
    },
    forwardedRef
  ) => {
    const slotRecipeFunction = useSlotRecipe({ recipe: fileUploadRecipe });

    const baseSlotStyles = slotRecipeFunction({ variant });

    const [isDragOver, setIsDragOver] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const fileInputId = useId();

    const isDropZoneVariant = variant === 'dropZone';
    const isInputVariant = variant === 'input';
    const isButtonVariant = variant === 'button';

    const isComponentDisabled = disabled === true;

    const selectedSingleFile = selectedFile ?? null;
    const hasSelectedSingleFile =
      selectedSingleFile !== null && selectedSingleFile.status !== 'idle';

    const computedDescriptionLines = Array.isArray(description)
      ? description
      : ['Max file size: 10 MB', 'Supported formats: csv, xls'];

    const fileInputAllowsMultipleSelection = isDropZoneVariant
      ? multiple
      : false;

    const visualState = isComponentDisabled
      ? 'disabled'
      : isDragOver
        ? 'dragOver'
        : 'idle';

    const openFileDialog = () => {
      if (isComponentDisabled) return;
      fileInputRef.current?.click();
    };

    const handleAccessibleOpenKeyDown = (
      keyboardEvent: KeyboardEvent<HTMLElement>
    ) => {
      const pressedKey = keyboardEvent.key;

      const isEnter = pressedKey === 'Enter';
      const isSpaceKey =
        pressedKey === ' ' ||
        pressedKey === 'Spacebar' ||
        pressedKey === 'Space';
      const isSpaceCode = keyboardEvent.code === 'Space';

      const shouldOpenDialog = isEnter || isSpaceKey || isSpaceCode;
      if (!shouldOpenDialog) return;
      if (isComponentDisabled) return;

      keyboardEvent.preventDefault();
      openFileDialog();
    };

    const handleFileInputChange = (
      changeEvent: ChangeEvent<HTMLInputElement>
    ) => {
      const selectedFileList = Array.from(
        changeEvent.currentTarget.files ?? []
      );
      onFilesSelected?.(selectedFileList);
      changeEvent.currentTarget.value = '';
    };

    const handleDropZoneDragOver = (dragEvent: DragEvent<HTMLElement>) => {
      dragEvent.preventDefault();
      dragEvent.stopPropagation();

      if (isComponentDisabled) return;
      setIsDragOver(true);
    };

    const handleDropZoneDragLeave = (dragEvent: DragEvent<HTMLElement>) => {
      dragEvent.preventDefault();
      dragEvent.stopPropagation();
      setIsDragOver(false);
    };

    const handleDropZoneDrop = (dragEvent: DragEvent<HTMLElement>) => {
      dragEvent.preventDefault();
      dragEvent.stopPropagation();

      setIsDragOver(false);
      if (isComponentDisabled) return;

      const droppedFileList = Array.from(dragEvent.dataTransfer.files ?? []);
      onFilesSelected?.(droppedFileList);
    };

    const removeFileFromList = (fileToRemove: FileUploadFile) => {
      onRemove?.(fileToRemove);

      if (!onChange) return;

      const nextFiles = files.filter(
        (currentFile) => currentFile.id !== fileToRemove.id
      );
      onChange(nextFiles);
    };

    const handleFileRemoveButtonClick = (
      mouseEvent: ReactMouseEvent<HTMLElement>
    ) => {
      const fileIdentifier =
        mouseEvent.currentTarget.getAttribute('data-file-id');
      if (!fileIdentifier) return;

      const fileToRemove = files.find(
        (currentFile) => currentFile.id === fileIdentifier
      );
      if (!fileToRemove) return;

      removeFileFromList(fileToRemove);
    };

    const removeSelectedSingleFile = () => {
      if (!selectedSingleFile) return;
      onRemove?.(selectedSingleFile);
    };

    const dropZoneStyleState = isDragOver ? 'dragOver' : 'idle';
    const dropZoneStateSlotStyles = useMemo(
      () =>
        slotRecipeFunction({
          variant,
          state: dropZoneStyleState
        } as FileStatusSlotStyles['options']),
      [slotRecipeFunction, variant, dropZoneStyleState]
    );

    const fileStatusSlotStylesByStatus = useMemo<
      Record<FileUploadFileStatus, typeof baseSlotStyles>
    >(
      () => ({
        idle: slotRecipeFunction({
          variant,
          fileStatus: 'idle'
        } as FileStatusSlotStyles['options']),
        uploading: slotRecipeFunction({
          variant,
          fileStatus: 'uploading'
        } as FileStatusSlotStyles['options']),
        success: slotRecipeFunction({
          variant,
          fileStatus: 'success'
        } as FileStatusSlotStyles['options']),
        error: slotRecipeFunction({
          variant,
          fileStatus: 'error'
        } as FileStatusSlotStyles['options'])
      }),
      [slotRecipeFunction, variant]
    );

    const fileInputNode = (
      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        accept={accept}
        multiple={fileInputAllowsMultipleSelection}
        onChange={handleFileInputChange}
        disabled={isComponentDisabled}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    );

    const dropZoneTabIndex = isComponentDisabled ? -1 : 0;
    const dropZoneAriaDisabledValue = isComponentDisabled;

    const dropZoneDescriptionLineNodes = computedDescriptionLines.map(
      (descriptionLine, descriptionLineIndex) => (
        <span key={descriptionLineIndex}>{descriptionLine}</span>
      )
    );

    const globalErrorNode = error ? (
      <Box css={baseSlotStyles.globalError} role="alert">
        <Box as="span" css={{ display: 'inline-flex', color: 'navyGray.700' }}>
          <ErrorExclamationIcon style={{ width: '16px', height: '16px' }} />
        </Box>
        <span>{error}</span>
      </Box>
    ) : null;

    const renderDropZoneVariant = () => {
      const hasFilesToRender = files.length > 0;

      const fileListItemNodes = files.map((fileItem) => {
        const fileNameText = fileItem.name ?? '';
        const fileIdentifier = fileItem.id ?? '';

        const isUploadingFile = fileItem.status === 'uploading';
        const isErrorFile = fileItem.status === 'error';
        const hasInlineErrorMessage =
          isErrorFile && Boolean(fileItem.errorMessage);

        const removeButtonAriaLabel = isUploadingFile
          ? `Cancel upload ${fileNameText}`
          : `Remove ${fileNameText}`;

        const perFileSlotStyles =
          fileStatusSlotStylesByStatus[fileItem.status] ?? baseSlotStyles;

        const loaderNode = isUploadingFile ? (
          <Box css={baseSlotStyles.loader}>
            <Spinner size="sm" color="currentColor" />
          </Box>
        ) : null;

        const statusIconNode = !isUploadingFile ? (
          <Box css={perFileSlotStyles.fileStatus}>
            {fileItem.status === 'success' ? (
              <CheckmarkFilledIcon style={{ width: '16px', height: '16px' }} />
            ) : fileItem.status === 'error' ? (
              <Box
                as="span"
                css={{ display: 'inline-flex', color: 'navyGray.700' }}
              >
                <ErrorExclamationIcon
                  style={{ width: '16px', height: '16px' }}
                />
              </Box>
            ) : null}
          </Box>
        ) : null;

        const fileErrorNode = hasInlineErrorMessage ? (
          <Box css={baseSlotStyles.fileError}>
            <Box
              as="span"
              css={{ display: 'inline-flex', color: 'navyGray.700' }}
            >
              <ErrorExclamationIcon style={{ width: '16px', height: '16px' }} />
            </Box>
            <span>{fileItem.errorMessage}</span>
          </Box>
        ) : null;

        return (
          <Box key={fileIdentifier}>
            <Box css={perFileSlotStyles.fileItem} data-status={fileItem.status}>
              <Box css={baseSlotStyles.fileIcon}>
                <FolderFileIcon style={{ width: '24px', height: '24px' }} />
              </Box>

              <Box css={baseSlotStyles.fileName}>{fileNameText}</Box>

              {loaderNode}
              {statusIconNode}

              <Box
                as="button"
                css={baseSlotStyles.fileAction}
                onClick={handleFileRemoveButtonClick}
                aria-label={removeButtonAriaLabel}
                data-file-id={fileIdentifier}
              >
                <CloseIcon style={{ width: '12px', height: '12px' }} />
              </Box>
            </Box>

            {fileErrorNode}
          </Box>
        );
      });

      const fileListNode = hasFilesToRender ? (
        <Box css={baseSlotStyles.fileList}>
          <Box css={baseSlotStyles.fileListLabel}>Uploaded files</Box>
          {fileListItemNodes}
        </Box>
      ) : null;

      return (
        <Box
          ref={forwardedRef}
          css={baseSlotStyles.root}
          data-state={visualState}
          data-variant={variant}
          {...restProps}
        >
          {fileInputNode}

          <Box
            css={dropZoneStateSlotStyles.dropArea}
            data-state={visualState}
            onClick={openFileDialog}
            onKeyDown={handleAccessibleOpenKeyDown}
            onDragOver={handleDropZoneDragOver}
            onDragLeave={handleDropZoneDragLeave}
            onDrop={handleDropZoneDrop}
            role="button"
            tabIndex={dropZoneTabIndex}
            aria-label="Drop files here or click to browse"
            aria-disabled={dropZoneAriaDisabledValue}
          >
            <Box css={baseSlotStyles.dropIcon}>
              <FolderUploadIcon style={{ width: '24px', height: '24px' }} />
            </Box>

            <Box css={baseSlotStyles.dropTitle}>Drag and drop files here</Box>

            <Box css={baseSlotStyles.dropDescription}>
              {dropZoneDescriptionLineNodes}
            </Box>
          </Box>

          {globalErrorNode}
          {fileListNode}
        </Box>
      );
    };

    const renderInputVariant = () => {
      const inputTextColor = hasSelectedSingleFile
        ? 'navyGray.700'
        : 'gray.400';

      const inputContainerOnClickHandler = hasSelectedSingleFile
        ? undefined
        : openFileDialog;
      const inputContainerOnKeyDownHandler = hasSelectedSingleFile
        ? undefined
        : handleAccessibleOpenKeyDown;

      const inputContainerRoleValue = hasSelectedSingleFile
        ? undefined
        : 'button';
      const inputContainerTabIndexValue =
        !hasSelectedSingleFile && !isComponentDisabled ? 0 : -1;

      const inputContainerAriaLabel = hasSelectedSingleFile
        ? undefined
        : placeholder;

      const selectedFileNameText = selectedSingleFile?.name ?? '';
      const inputDisplayText = hasSelectedSingleFile
        ? selectedFileNameText
        : placeholder;

      const inputIconNode = hasSelectedSingleFile ? (
        <FolderFileIcon style={{ width: '16px', height: '16px' }} />
      ) : (
        <FolderUploadIcon style={{ width: '16px', height: '16px' }} />
      );

      const inputCloseButtonAriaLabel = hasSelectedSingleFile
        ? `Remove ${selectedFileNameText}`
        : undefined;

      const inputCloseButtonNode = hasSelectedSingleFile ? (
        <Box
          as="button"
          css={baseSlotStyles.inputCloseButton}
          onClick={removeSelectedSingleFile}
          aria-label={inputCloseButtonAriaLabel}
        >
          <CloseIcon style={{ width: '16px', height: '16px' }} />
        </Box>
      ) : null;

      const hasLabelContent = Boolean(label) || Boolean(labelSubtext);

      const labelRowNode = label ? (
        <Box css={baseSlotStyles.labelRow}>
          <Box css={baseSlotStyles.labelText}>{label}</Box>
          {required ? (
            <Box css={baseSlotStyles.requiredIndicator}>*</Box>
          ) : null}
          {showOptional ? (
            <Box css={baseSlotStyles.optionalIndicator}>(optional)</Box>
          ) : null}
        </Box>
      ) : null;

      const labelSubtextNode = labelSubtext ? (
        <Box css={baseSlotStyles.labelSubtext}>{labelSubtext}</Box>
      ) : null;

      const labelWrapperNode = hasLabelContent ? (
        <Box css={baseSlotStyles.labelWrapper}>
          {labelRowNode}
          {labelSubtextNode}
        </Box>
      ) : null;

      const supportingTextNode = supportingText ? (
        <Box css={baseSlotStyles.supportingText}>{supportingText}</Box>
      ) : null;

      return (
        <Box
          ref={forwardedRef}
          css={baseSlotStyles.root}
          data-state={visualState}
          data-variant={variant}
          {...restProps}
        >
          {fileInputNode}

          <Box css={baseSlotStyles.labelContainer}>
            {labelWrapperNode}

            <Box
              css={baseSlotStyles.inputContainer}
              onClick={inputContainerOnClickHandler}
              onKeyDown={inputContainerOnKeyDownHandler}
              role={inputContainerRoleValue}
              tabIndex={inputContainerTabIndexValue}
              aria-label={inputContainerAriaLabel}
              aria-disabled={isComponentDisabled}
              data-state={hasSelectedSingleFile ? 'filled' : 'default'}
            >
              <Box css={baseSlotStyles.inputIconContainer}>{inputIconNode}</Box>

              <Box
                css={{
                  ...(baseSlotStyles.inputText as Record<string, unknown>),
                  color: inputTextColor
                }}
              >
                {inputDisplayText}
              </Box>

              {inputCloseButtonNode}
            </Box>
          </Box>

          {supportingTextNode}
        </Box>
      );
    };

    const renderButtonVariant = () => {
      const uploadButtonAriaLabel = buttonLabel;

      const uploadButtonNode = !hasSelectedSingleFile ? (
        <Box
          as="button"
          css={baseSlotStyles.uploadButton}
          onClick={openFileDialog}
          onKeyDown={handleAccessibleOpenKeyDown}
          aria-label={uploadButtonAriaLabel}
          aria-disabled={isComponentDisabled}
        >
          <Box css={baseSlotStyles.uploadButtonContent}>
            <FolderUploadIcon style={{ width: '24px', height: '24px' }} />
            <span>{buttonLabel}</span>
          </Box>
        </Box>
      ) : null;

      const selectedFileNameText = selectedSingleFile?.name ?? '';

      const selectedFileAvatarNode = selectedSingleFile?.previewUrl ? (
        <Box css={baseSlotStyles.selectedFileAvatar}>
          <img
            src={selectedSingleFile.previewUrl}
            alt={selectedFileNameText}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      ) : (
        <Box as="span" css={{ display: 'inline-flex', color: 'navyGray.700' }}>
          <FolderFileIcon style={{ width: '24px', height: '24px' }} />
        </Box>
      );

      const selectedFileRemoveAriaLabel = `Remove ${selectedFileNameText}`;

      const selectedFileNode = hasSelectedSingleFile ? (
        <Box css={baseSlotStyles.selectedFile}>
          {selectedFileAvatarNode}
          <Box css={baseSlotStyles.selectedFileName}>
            {selectedFileNameText}
          </Box>
          <Box
            as="button"
            css={baseSlotStyles.selectedFileAction}
            onClick={removeSelectedSingleFile}
            aria-label={selectedFileRemoveAriaLabel}
          >
            <Box as="span" css={{ display: 'inline-flex', color: 'gray.600' }}>
              <BinIcon style={{ width: '16px', height: '16px' }} />
            </Box>
          </Box>
        </Box>
      ) : null;

      return (
        <Box
          ref={forwardedRef}
          css={baseSlotStyles.root}
          data-state={visualState}
          data-variant={variant}
          {...restProps}
        >
          {fileInputNode}
          {uploadButtonNode}
          {selectedFileNode}
          {globalErrorNode}
        </Box>
      );
    };

    if (isInputVariant) return renderInputVariant();
    if (isButtonVariant) return renderButtonVariant();

    return renderDropZoneVariant();
  }
);

FileUpload.displayName = 'FileUpload';
