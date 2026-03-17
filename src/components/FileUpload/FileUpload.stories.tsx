import type { Decorator, Meta, StoryObj } from '@storybook/react';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FileUpload } from './FileUpload';
import type { FileUploadFile } from './FileUpload';

const CenteredLayoutParameters = {
  layout: 'centered'
} as const;

function createFixedWidthDecorator(containerWidth: string): Decorator {
  const decorator: Decorator = (Story) => {
    return (
      <div style={{ width: containerWidth }}>
        <Story />
      </div>
    );
  };

  return decorator;
}

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    ...CenteredLayoutParameters,
    docs: {
      description: {
        component:
          'FileUpload supports three variants: Button, DropZone, and Input. It uses a hidden file input and exposes accessible, keyboard-friendly interactions across variants.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['dropZone', 'button', 'input'],
      description: 'Visual variant of the file upload component'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text (input variant only)'
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection (dropZone variant only)'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the file upload'
    },
    error: {
      control: 'text',
      description: 'Global error message (dropZone + button variants)'
    },
    accept: {
      control: 'text',
      description: 'Accepted file types'
    },
    buttonLabel: {
      control: 'text',
      description: 'Button label (button variant only)'
    },
    label: {
      control: 'text',
      description: 'Label text (input variant only)'
    },
    labelSubtext: {
      control: 'text',
      description: 'Label subtext (input variant only)'
    },
    supportingText: {
      control: 'text',
      description: 'Supporting text (input variant only)'
    },
    required: {
      control: 'boolean',
      description: 'Show required indicator (*) (input variant only)'
    },
    showOptional: {
      control: 'boolean',
      description: 'Show optional indicator (input variant only)'
    }
  }
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

/* -------------------------------------------------------------------------------------------------
 * BUTTON
 * ------------------------------------------------------------------------------------------------- */

export const Button: Story = {
  name: 'Button / Default',
  args: {
    variant: 'button',
    buttonLabel: 'Upload File'
  }
};

export const ButtonWithCustomLabel: Story = {
  name: 'Button / Custom Label',
  args: {
    variant: 'button',
    buttonLabel: 'Choose Image',
    accept: 'image/*'
  }
};

export const ButtonWithSelectedFile: Story = {
  name: 'Button / Filled (With Preview)',
  args: {
    variant: 'button',
    selectedFile: {
      id: '1',
      name: 'Andrew.png',
      status: 'success',
      previewUrl: 'https://i.pravatar.cc/150?img=3'
    }
  }
};

export const ButtonWithSelectedFileNoPreview: Story = {
  name: 'Button / Filled (No Preview)',
  args: {
    variant: 'button',
    selectedFile: {
      id: '1',
      name: 'document.pdf',
      status: 'success'
    }
  }
};

export const ButtonDisabled: Story = {
  name: 'Button / Disabled',
  args: {
    variant: 'button',
    buttonLabel: 'Upload File',
    disabled: true
  }
};

export const ButtonWithError: Story = {
  name: 'Button / Global Error',
  args: {
    variant: 'button',
    buttonLabel: 'Upload File',
    error: 'File type not supported'
  }
};

/* -------------------------------------------------------------------------------------------------
 * DROP ZONE
 * ------------------------------------------------------------------------------------------------- */

export const DropZone: Story = {
  name: 'DropZone / Default',
  args: {
    variant: 'dropZone',
    description: ['Max file size: 10 MB', 'Supported formats: csv, xls']
  }
};

export const DropZoneWithFiles: Story = {
  name: 'DropZone / With Files (All States)',
  args: {
    variant: 'dropZone',
    files: [
      { id: '1', name: 'template_old_contacts.csv', status: 'uploading' },
      { id: '2', name: 'data_export.csv', status: 'success' },
      {
        id: '3',
        name: 'invalid_file.txt',
        status: 'error',
        errorMessage: 'Invalid file format'
      }
    ]
  }
};

export const DropZoneUploading: Story = {
  name: 'DropZone / Uploading',
  args: {
    variant: 'dropZone',
    files: [
      {
        id: '1',
        name: 'template_old_contacts.csv',
        status: 'uploading',
        progress: 45
      }
    ]
  }
};

export const DropZoneSuccess: Story = {
  name: 'DropZone / Success',
  args: {
    variant: 'dropZone',
    files: [{ id: '1', name: 'template_old_contacts.csv', status: 'success' }]
  }
};

export const DropZoneError: Story = {
  name: 'DropZone / Inline Error',
  args: {
    variant: 'dropZone',
    files: [
      {
        id: '1',
        name: 'template_old_contacts.csv',
        status: 'error',
        errorMessage: 'File size exceeds limit'
      }
    ]
  }
};

export const DropZoneGlobalError: Story = {
  name: 'DropZone / Global Error',
  args: {
    variant: 'dropZone',
    files: [
      { id: '1', name: 'file1.csv', status: 'success' },
      { id: '2', name: 'file2.csv', status: 'success' }
    ],
    error: 'Maximum 5 files can be uploaded'
  }
};

export const DropZoneDisabled: Story = {
  name: 'DropZone / Disabled',
  args: {
    variant: 'dropZone',
    disabled: true,
    files: [{ id: '1', name: 'template_old_contacts.csv', status: 'success' }]
  }
};

export const DropZoneSingleFile: Story = {
  name: 'DropZone / Single File Mode',
  args: {
    variant: 'dropZone',
    multiple: false,
    description: ['Max file size: 10 MB', 'Single file upload only']
  }
};

/* -------------------------------------------------------------------------------------------------
 * INPUT
 * ------------------------------------------------------------------------------------------------- */

export const Input: Story = {
  name: 'Input / Default',
  args: {
    variant: 'input',
    label: 'Upload File',
    labelSubtext: 'Label subtext',
    placeholder: 'Select File(s)',
    supportingText: 'Supporting text',
    required: true,
    showOptional: true
  },
  decorators: [createFixedWidthDecorator('280px')]
};

export const InputFilled: Story = {
  name: 'Input / Filled',
  args: {
    variant: 'input',
    label: 'Upload File',
    labelSubtext: 'Label subtext',
    placeholder: 'Select File(s)',
    supportingText: 'Supporting text',
    required: true,
    showOptional: true,
    selectedFile: {
      id: '1',
      name: 'Image 5.png',
      status: 'success'
    }
  },
  decorators: [createFixedWidthDecorator('280px')]
};

export const InputDisabled: Story = {
  name: 'Input / Disabled',
  args: {
    variant: 'input',
    label: 'Upload File',
    placeholder: 'Select File(s)',
    disabled: true
  },
  decorators: [createFixedWidthDecorator('280px')]
};

export const InputWithoutLabel: Story = {
  name: 'Input / Without Label',
  args: {
    variant: 'input',
    placeholder: 'Select File(s)'
  },
  decorators: [createFixedWidthDecorator('280px')]
};

/* -------------------------------------------------------------------------------------------------
 * INTERACTIVE DEMOS
 * ------------------------------------------------------------------------------------------------- */

function buildUploadingFiles(selectedFiles: File[]): FileUploadFile[] {
  const timestamp = Date.now();

  return selectedFiles.map<FileUploadFile>(
    (selectedFile, selectedFileIndex) => {
      return {
        id: `${timestamp}-${selectedFileIndex}`,
        name: selectedFile.name,
        size: selectedFile.size,
        status: 'uploading'
      };
    }
  );
}

function InteractiveButtonTemplate(): ReactElement {
  const [selectedSingleFile, setSelectedSingleFile] =
    useState<FileUploadFile | null>(null);
  const [globalErrorMessage, setGlobalErrorMessage] = useState<
    string | undefined
  >();

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    const firstSelectedFile = selectedFiles[0];
    if (!firstSelectedFile) return;

    const isFileTooLarge = firstSelectedFile.size > 5 * 1024 * 1024;
    if (isFileTooLarge) {
      setGlobalErrorMessage('File size exceeds 5 MB limit');
      return;
    }

    setGlobalErrorMessage(undefined);

    const nextFile: FileUploadFile = {
      id: `${Date.now()}`,
      name: firstSelectedFile.name,
      size: firstSelectedFile.size,
      status: 'uploading'
    };

    setSelectedSingleFile(nextFile);

    window.setTimeout(() => {
      const isImageFile = firstSelectedFile.type.startsWith('image/');

      if (!isImageFile) {
        setSelectedSingleFile((previousFile) => {
          return previousFile ? { ...previousFile, status: 'success' } : null;
        });
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = (loadEvent) => {
        const previewUrlValue =
          (loadEvent.target?.result as string | undefined) ?? '';

        setSelectedSingleFile((previousFile) => {
          return previousFile
            ? {
                ...previousFile,
                status: 'success',
                previewUrl: previewUrlValue
              }
            : null;
        });
      };

      fileReader.readAsDataURL(firstSelectedFile);
    }, 1500);
  }, []);

  const handleRemove = useCallback(() => {
    setSelectedSingleFile(null);
    setGlobalErrorMessage(undefined);
  }, []);

  return (
    <FileUpload
      variant="button"
      buttonLabel="Upload File"
      selectedFile={selectedSingleFile}
      onFilesSelected={handleFilesSelected}
      onRemove={handleRemove}
      error={globalErrorMessage}
      accept="image/*,.pdf,.doc,.docx"
    />
  );
}

export const InteractiveButton: Story = {
  name: 'Interactive / Button',
  render: () => <InteractiveButtonTemplate />
};

function InteractiveDropZoneTemplate(): ReactElement {
  const [controlledFiles, setControlledFiles] = useState<FileUploadFile[]>([]);
  const [globalErrorMessage, setGlobalErrorMessage] = useState<
    string | undefined
  >();

  const handleFilesSelected = useCallback(
    (selectedFiles: File[]) => {
      const nextFiles = buildUploadingFiles(selectedFiles);

      const wouldExceedMaxFileCount =
        controlledFiles.length + nextFiles.length > 5;
      if (wouldExceedMaxFileCount) {
        setGlobalErrorMessage('Maximum 5 files can be uploaded');
        return;
      }

      setGlobalErrorMessage(undefined);
      setControlledFiles((previousFiles) => {
        return [...previousFiles, ...nextFiles];
      });

      nextFiles.forEach((createdFile, createdFileIndex) => {
        window.setTimeout(
          () => {
            setControlledFiles((previousFiles) => {
              return previousFiles.map((previousFile) => {
                const isTargetFile = previousFile.id === createdFile.id;
                if (!isTargetFile) return previousFile;

                const shouldSucceed = Math.random() > 0.3;
                const shouldHaveErrorMessage = Math.random() <= 0.3;

                return {
                  ...previousFile,
                  status: shouldSucceed ? 'success' : 'error',
                  errorMessage: shouldHaveErrorMessage
                    ? 'Upload failed'
                    : undefined
                };
              });
            });
          },
          1000 + createdFileIndex * 500
        );
      });
    },
    [controlledFiles.length]
  );

  const handleRemove = useCallback(
    (fileToRemove: FileUploadFile) => {
      setControlledFiles((previousFiles) => {
        return previousFiles.filter((previousFile) => {
          return previousFile.id !== fileToRemove.id;
        });
      });

      if (controlledFiles.length <= 5) {
        setGlobalErrorMessage(undefined);
      }
    },
    [controlledFiles.length]
  );

  return (
    <FileUpload
      variant="dropZone"
      files={controlledFiles}
      onChange={setControlledFiles}
      onFilesSelected={handleFilesSelected}
      onRemove={handleRemove}
      error={globalErrorMessage}
      description={['Max file size: 10 MB', 'Supported formats: csv, xls']}
    />
  );
}

export const InteractiveDropZone: Story = {
  name: 'Interactive / DropZone',
  render: () => <InteractiveDropZoneTemplate />
};

function InteractiveInputTemplate(): ReactElement {
  const [selectedSingleFile, setSelectedSingleFile] =
    useState<FileUploadFile | null>(null);

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    const firstSelectedFile = selectedFiles[0];
    if (!firstSelectedFile) return;

    const nextFile: FileUploadFile = {
      id: `${Date.now()}`,
      name: firstSelectedFile.name,
      size: firstSelectedFile.size,
      status: 'success'
    };

    setSelectedSingleFile(nextFile);
  }, []);

  const handleRemove = useCallback(() => {
    setSelectedSingleFile(null);
  }, []);

  return (
    <div style={{ width: '280px' }}>
      <FileUpload
        variant="input"
        placeholder="Select File(s)"
        selectedFile={selectedSingleFile}
        onFilesSelected={handleFilesSelected}
        onRemove={handleRemove}
        accept="image/*,.pdf,.doc,.docx,.csv,.xls,.xlsx"
      />
    </div>
  );
}

export const InteractiveInput: Story = {
  name: 'Interactive / Input',
  render: () => <InteractiveInputTemplate />
};
