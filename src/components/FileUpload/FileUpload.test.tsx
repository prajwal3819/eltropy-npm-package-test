import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../../test/test-utils';
import { FileUpload } from './FileUpload';
import type { FileUploadFile } from './FileUpload';

function getHiddenFileInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector('input[type="file"]');

  if (!(input instanceof HTMLInputElement)) {
    throw new Error("Expected a hidden file input (<input type='file'>).");
  }

  return input;
}

function setInputFiles(input: HTMLInputElement, files: File[]): void {
  Object.defineProperty(input, 'files', {
    value: files,
    configurable: true
  });
}

function buildBrowserFile(name: string, type = 'text/csv'): File {
  return new File(['content'], name, { type });
}

function buildFileUploadFile(
  overrides: Partial<FileUploadFile>
): FileUploadFile {
  return {
    id: 'file-1',
    name: 'file.csv',
    status: 'success',
    ...overrides
  };
}

describe('FileUpload', () => {
  it('should have a displayName', () => {
    expect(FileUpload.displayName).toBe('FileUpload');
  });

  describe('DropZone variant', () => {
    it('renders default description when no description is provided', () => {
      render(<FileUpload variant="dropZone" />);

      expect(screen.getByText('Drag and drop files here')).toBeInTheDocument();
      expect(screen.getByText('Max file size: 10 MB')).toBeInTheDocument();
      expect(
        screen.getByText('Supported formats: csv, xls')
      ).toBeInTheDocument();
    });

    it('renders custom description lines', () => {
      render(
        <FileUpload
          variant="dropZone"
          description={['Custom line 1', 'Custom line 2']}
        />
      );

      expect(screen.getByText('Custom line 1')).toBeInTheDocument();
      expect(screen.getByText('Custom line 2')).toBeInTheDocument();
    });

    it('falls back to default description when description is not an array', () => {
      render(
        <FileUpload
          variant="dropZone"
          description={null as unknown as string[]}
        />
      );

      expect(screen.getByText('Max file size: 10 MB')).toBeInTheDocument();
      expect(
        screen.getByText('Supported formats: csv, xls')
      ).toBeInTheDocument();
    });

    it('exposes the drop area as an accessible button', () => {
      render(<FileUpload variant="dropZone" />);

      expect(
        screen.getByRole('button', {
          name: /drop files here or click to browse/i
        })
      ).toBeInTheDocument();
    });

    it('does not render the file list label when files are empty', () => {
      render(<FileUpload variant="dropZone" files={[]} />);

      expect(screen.queryByText('Uploaded files')).not.toBeInTheDocument();
    });

    it('renders a file list with mixed states and inline error message', () => {
      const files: FileUploadFile[] = [
        buildFileUploadFile({ id: '1', name: 'a.csv', status: 'success' }),
        buildFileUploadFile({ id: '2', name: 'b.csv', status: 'uploading' }),
        buildFileUploadFile({
          id: '3',
          name: 'c.csv',
          status: 'error',
          errorMessage: 'Upload failed'
        })
      ];

      render(<FileUpload variant="dropZone" files={files} />);

      expect(screen.getByText('Uploaded files')).toBeInTheDocument();
      expect(screen.getByText('a.csv')).toBeInTheDocument();
      expect(screen.getByText('b.csv')).toBeInTheDocument();
      expect(screen.getByText('c.csv')).toBeInTheDocument();
      expect(screen.getByText('Upload failed')).toBeInTheDocument();
    });

    it("labels the remove action as 'Cancel upload' for uploading files", () => {
      const files: FileUploadFile[] = [
        buildFileUploadFile({
          id: '1',
          name: 'upload.csv',
          status: 'uploading'
        })
      ];

      render(<FileUpload variant="dropZone" files={files} />);

      expect(
        screen.getByRole('button', { name: 'Cancel upload upload.csv' })
      ).toBeInTheDocument();
    });

    it('opens the file dialog on click', async () => {
      const user = userEvent.setup();
      const { container } = render(<FileUpload variant="dropZone" />);

      const input = getHiddenFileInput(container);
      const clickSpy = vi.spyOn(input, 'click');

      await user.click(
        screen.getByRole('button', {
          name: /drop files here or click to browse/i
        })
      );

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('opens the file dialog with Enter key', async () => {
      const user = userEvent.setup();
      const { container } = render(<FileUpload variant="dropZone" />);

      const input = getHiddenFileInput(container);
      const clickSpy = vi.spyOn(input, 'click');

      const dropArea = screen.getByRole('button', {
        name: /drop files here or click to browse/i
      });

      dropArea.focus();
      await user.keyboard('{Enter}');

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('opens the file dialog with Space key', async () => {
      const user = userEvent.setup();
      const { container } = render(<FileUpload variant="dropZone" />);

      const input = getHiddenFileInput(container);
      const clickSpy = vi.spyOn(input, 'click');

      const dropArea = screen.getByRole('button', {
        name: /drop files here or click to browse/i
      });

      dropArea.focus();
      await user.keyboard('{Space}');

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('calls onFilesSelected when files are selected via the hidden input', () => {
      const onFilesSelected = vi.fn();
      const { container } = render(
        <FileUpload variant="dropZone" onFilesSelected={onFilesSelected} />
      );

      const input = getHiddenFileInput(container);
      const file = buildBrowserFile('selected.csv');

      setInputFiles(input, [file]);
      fireEvent.change(input);

      expect(onFilesSelected).toHaveBeenCalledTimes(1);
      expect(onFilesSelected).toHaveBeenCalledWith([file]);
      expect(input.value).toBe('');
    });

    it('calls onFilesSelected when files are dropped', () => {
      const onFilesSelected = vi.fn();
      render(
        <FileUpload variant="dropZone" onFilesSelected={onFilesSelected} />
      );

      const dropArea = screen.getByRole('button', {
        name: /drop files here or click to browse/i
      });

      const droppedFile = buildBrowserFile('dropped.csv');

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [droppedFile] }
      });

      expect(onFilesSelected).toHaveBeenCalledTimes(1);
      expect(onFilesSelected).toHaveBeenCalledWith([droppedFile]);
    });

    it('respects accept and multiple props on the hidden input', () => {
      const { container } = render(
        <FileUpload variant="dropZone" accept=".csv,.xlsx" multiple={false} />
      );

      const input = getHiddenFileInput(container);
      expect(input.accept).toBe('.csv,.xlsx');
      expect(input.multiple).toBe(false);
    });

    it('calls onRemove and onChange with the updated list when a file is removed', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      const onChange = vi.fn();

      const files: FileUploadFile[] = [
        buildFileUploadFile({ id: '1', name: 'a.csv', status: 'success' }),
        buildFileUploadFile({ id: '2', name: 'b.csv', status: 'success' })
      ];

      render(
        <FileUpload
          variant="dropZone"
          files={files}
          onRemove={onRemove}
          onChange={onChange}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Remove a.csv' }));

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove).toHaveBeenCalledWith(files[0]);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith([files[1]]);
    });

    it('renders a global error banner (role=alert) when error is provided', () => {
      render(
        <FileUpload
          variant="dropZone"
          error="Maximum 5 files can be uploaded"
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(
        screen.getByText('Maximum 5 files can be uploaded')
      ).toBeInTheDocument();
    });

    it('disables interactions when disabled', async () => {
      const user = userEvent.setup();
      const onFilesSelected = vi.fn();
      const { container } = render(
        <FileUpload
          variant="dropZone"
          disabled
          onFilesSelected={onFilesSelected}
        />
      );

      const input = getHiddenFileInput(container);
      expect(input.disabled).toBe(true);

      const dropArea = screen.getByRole('button', {
        name: /drop files here or click to browse/i
      });

      expect(dropArea).toHaveAttribute('aria-disabled', 'true');
      expect(dropArea).toHaveAttribute('tabindex', '-1');

      const clickSpy = vi.spyOn(input, 'click');
      await user.click(dropArea);
      expect(clickSpy).toHaveBeenCalledTimes(0);

      fireEvent.drop(dropArea, {
        dataTransfer: { files: [buildBrowserFile('x.csv')] }
      });
      expect(onFilesSelected).toHaveBeenCalledTimes(0);
    });
  });

  describe('Input variant', () => {
    it('exposes the empty control as a button labeled by placeholder', () => {
      render(
        <FileUpload
          variant="input"
          label="Upload File"
          labelSubtext="Label subtext"
          placeholder="Select File(s)"
          supportingText="Supporting text"
          required
          showOptional
        />
      );

      expect(screen.getByText('Upload File')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('(optional)')).toBeInTheDocument();
      expect(screen.getByText('Supporting text')).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Select File(s)' })
      ).toBeInTheDocument();
    });

    it('opens the file dialog on click when empty', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <FileUpload variant="input" placeholder="Select File(s)" />
      );

      const input = getHiddenFileInput(container);
      const clickSpy = vi.spyOn(input, 'click');

      await user.click(screen.getByRole('button', { name: 'Select File(s)' }));
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('renders a removable selected file row and calls onRemove', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();

      const selectedFile: FileUploadFile = buildFileUploadFile({
        id: '1',
        name: 'picked.csv',
        status: 'success'
      });

      render(
        <FileUpload
          variant="input"
          placeholder="Select File(s)"
          selectedFile={selectedFile}
          onRemove={onRemove}
        />
      );

      expect(screen.getByText('picked.csv')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Select File(s)' })
      ).not.toBeInTheDocument();

      await user.click(
        screen.getByRole('button', { name: 'Remove picked.csv' })
      );
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove).toHaveBeenCalledWith(selectedFile);
    });

    it('forces single-file selection for input variant even if multiple=true is passed', () => {
      const { container } = render(<FileUpload variant="input" multiple />);
      expect(getHiddenFileInput(container).multiple).toBe(false);
    });
  });

  describe('Button variant', () => {
    it('renders an upload button and opens the file dialog on click when empty', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <FileUpload variant="button" buttonLabel="Upload File" />
      );

      const input = getHiddenFileInput(container);
      const clickSpy = vi.spyOn(input, 'click');

      await user.click(screen.getByRole('button', { name: 'Upload File' }));
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('renders a selected file row and calls onRemove on remove action', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();

      const selectedFile: FileUploadFile = buildFileUploadFile({
        id: '1',
        name: 'document.pdf',
        status: 'success'
      });

      render(
        <FileUpload
          variant="button"
          selectedFile={selectedFile}
          onRemove={onRemove}
        />
      );

      expect(screen.getByText('document.pdf')).toBeInTheDocument();

      await user.click(
        screen.getByRole('button', { name: 'Remove document.pdf' })
      );
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove).toHaveBeenCalledWith(selectedFile);
    });

    it('renders a global error banner (role=alert) when error is provided', () => {
      render(
        <FileUpload
          variant="button"
          buttonLabel="Upload File"
          error="Bad file"
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Bad file')).toBeInTheDocument();
    });

    it('forces single-file selection for button variant even if multiple=true is passed', () => {
      const { container } = render(<FileUpload variant="button" multiple />);
      expect(getHiddenFileInput(container).multiple).toBe(false);
    });
  });
});
