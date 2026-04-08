import { defineSlotRecipe } from '@chakra-ui/react';

export const fileUploadRecipe = defineSlotRecipe({
  className: 'file-upload',
  slots: [
    'root',
    'dropArea',
    'dropIcon',
    'dropTitle',
    'dropDescription',
    'uploadButton',
    'uploadButtonContent',
    'selectedFile',
    'selectedFileAvatar',
    'selectedFileName',
    'selectedFileAction',
    'fileList',
    'fileListLabel',
    'fileItem',
    'fileIcon',
    'fileName',
    'fileStatus',
    'fileAction',
    'fileError',
    'globalError',
    'loader',
    'inputContainer',
    'inputIconContainer',
    'inputText',
    'inputCloseButton',
    'labelContainer',
    'labelWrapper',
    'labelRow',
    'labelText',
    'requiredIndicator',
    'optionalIndicator',
    'labelSubtext',
    'supportingText'
  ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4',
      width: 'full'
    },
    dropArea: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2',
      padding: '6',
      bg: 'gray.50',
      borderWidth: '1px',
      borderStyle: 'dashed',
      borderColor: 'gray.400',
      borderRadius: 'lg',
      cursor: 'pointer',
      transition: 'all 0.2s',
      _hover: {
        borderColor: 'green.200',
        bg: 'green.50'
      }
    },
    dropIcon: {
      color: 'navyGray.700',
      fontSize: '24px'
    },
    dropTitle: {
      fontWeight: 'bold',
      fontSize: '16px',
      lineHeight: '24px',
      color: 'navyGray.700',
      textAlign: 'center'
    },
    dropDescription: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize: '12px',
      lineHeight: '18px',
      color: 'gray.600',
      textAlign: 'center'
    },
    uploadButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '32px',
      bg: 'green.200',
      borderRadius: 'md',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.2s',
      _hover: {
        bg: 'green.300'
      },
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed'
      }
    },
    uploadButtonContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1',
      paddingX: '4',
      paddingY: '2',
      fontWeight: 'bold',
      fontSize: '12px',
      lineHeight: 'normal',
      color: 'base.white'
    },
    selectedFile: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    selectedFileAvatar: {
      flexShrink: 0,
      width: '24px',
      height: '24px',
      borderRadius: 'full',
      overflow: 'hidden',
      bg: 'gray.100'
    },
    selectedFileName: {
      fontSize: '12px',
      lineHeight: '18px',
      color: 'navyGray.700',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    selectedFileAction: {
      flexShrink: 0,
      width: '24px',
      height: '24px',
      padding: '0',
      bg: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'navyGray.700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      _hover: {
        color: 'gray.600'
      }
    },
    fileList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
      width: 'full'
    },
    fileListLabel: {
      fontWeight: 'medium',
      fontSize: '12px',
      lineHeight: 'normal',
      color: 'navyGray.700'
    },
    fileItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      padding: '2',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'gray.200',
      borderRadius: 'md',
      minHeight: '40px'
    },
    fileIcon: {
      flexShrink: 0,
      color: 'navyGray.700',
      fontSize: '24px'
    },
    fileName: {
      flex: 1,
      fontSize: '12px',
      lineHeight: '18px',
      color: 'navyGray.700',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    fileStatus: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      overflow: 'visible'
    },
    fileAction: {
      flexShrink: 0,
      padding: '0',
      bg: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'navyGray.700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      _hover: {
        color: 'gray.600'
      }
    },
    fileError: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      marginTop: '4px',
      fontWeight: 'medium',
      fontSize: '12px',
      lineHeight: '18px',
      color: 'red.200'
    },
    globalError: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      minHeight: '16px',
      fontWeight: 'medium',
      fontSize: '12px',
      lineHeight: 'normal',
      color: 'red.200'
    },
    loader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: '24px',
      height: '24px',
      color: 'navyGray.700'
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      height: '40px',
      padding: '12px',
      bg: 'base.white',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'gray.200',
      borderRadius: '12px',
      cursor: 'pointer',
      overflow: 'hidden',
      transition: 'all 0.2s',
      _hover: {
        borderColor: 'gray.400'
      }
    },
    inputIconContainer: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      color: 'navyGray.700'
    },
    inputText: {
      flex: 1,
      fontSize: '14px',
      lineHeight: '20px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    inputCloseButton: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      padding: '0',
      bg: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'navyGray.700',
      _hover: {
        color: 'gray.600'
      }
    },
    labelContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: 'full'
    },
    labelWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      width: 'full'
    },
    labelRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    labelText: {
      fontWeight: 'medium',
      fontSize: '12px',
      lineHeight: 'normal',
      color: 'navyGray.700'
    },
    requiredIndicator: {
      fontWeight: 'medium',
      fontSize: '16px',
      lineHeight: 'normal',
      color: 'red.200'
    },
    optionalIndicator: {
      fontWeight: 'regular',
      fontSize: '12px',
      lineHeight: '18px',
      color: 'gray.400'
    },
    labelSubtext: {
      fontWeight: 'medium',
      fontSize: '12px',
      lineHeight: 'normal',
      color: 'gray.600'
    },
    supportingText: {
      fontWeight: 'regular',
      fontSize: '12px',
      lineHeight: '18px',
      color: 'gray.600'
    }
  },
  variants: {
    variant: {
      dropZone: {},
      button: {
        root: {
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '2',
          width: 'auto'
        }
      },
      input: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          gap: '3',
          width: 'full'
        }
      }
    },
    state: {
      idle: {},
      dragOver: {
        dropArea: {
          borderColor: 'green.200',
          bg: 'green.50'
        }
      },
      disabled: {
        root: {
          opacity: 0.5,
          pointerEvents: 'none'
        },
        dropArea: {
          cursor: 'not-allowed'
        },
        uploadButton: {
          cursor: 'not-allowed'
        }
      }
    },
    fileStatus: {
      idle: {},
      uploading: {
        fileStatus: {
          color: 'navyGray.700'
        }
      },
      success: {
        fileStatus: {
          color: 'successGreen.200'
        }
      },
      error: {
        fileItem: {
          borderColor: 'red.200'
        },
        fileStatus: {
          color: 'red.200'
        }
      }
    }
  },
  defaultVariants: {
    variant: 'dropZone',
    state: 'idle'
  }
});
