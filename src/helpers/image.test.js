import imageHelpers from './image';

describe('imageHelpers', () => {
  describe('getImageWithCrop', () => {
    it('should return cropped image URL with correct parameters', () => {
      const result = imageHelpers.getImageWithCrop({
        src: 'https://ik.imagekit.io/ryanvalle/test-image.jpg',
        width: 800,
        quality: 80
      });
      expect(result).toBe('https://ik.imagekit.io/ryanvalle/tr:q-80,w-800,h-800/test-image.jpg');
    });

    it('should use default quality of 90 when not provided', () => {
      const result = imageHelpers.getImageWithCrop({
        src: 'https://ik.imagekit.io/ryanvalle/test-image.jpg',
        width: 600
      });
      expect(result).toBe('https://ik.imagekit.io/ryanvalle/tr:q-90,w-600,h-600/test-image.jpg');
    });

    it('should cap width at 2000 for large values', () => {
      const result = imageHelpers.getImageWithCrop({
        src: 'https://ik.imagekit.io/ryanvalle/test-image.jpg',
        width: 3000,
        quality: 90
      });
      expect(result).toBe('https://ik.imagekit.io/ryanvalle/tr:q-90,w-2000,h-2000/test-image.jpg');
    });

    it('should handle query parameters in src URL', () => {
      const result = imageHelpers.getImageWithCrop({
        src: 'https://ik.imagekit.io/ryanvalle/test-image.jpg?param=value',
        width: 800,
        quality: 90
      });
      expect(result).toBe('https://ik.imagekit.io/ryanvalle/tr:q-90,w-800,h-800/test-image.jpg');
    });
  });

  describe('getImage', () => {
    it('should return image URL with at_max constraint', () => {
      const result = imageHelpers.getImage({
        src: 'https://ik.imagekit.io/ryanvalle/test-image.jpg',
        width: 800,
        quality: 80
      });
      expect(result).toBe('https://ik.imagekit.io/ryanvalle/tr:q-80,w-800,h-800,c-at_max/test-image.jpg');
    });

    it('should use default quality of 90 when not provided', () => {
      const result = imageHelpers.getImage({
        src: 'https://ik.imagekit.io/ryanvalle/test-image.jpg',
        width: 600
      });
      expect(result).toBe('https://ik.imagekit.io/ryanvalle/tr:q-90,w-600,h-600,c-at_max/test-image.jpg');
    });
  });

  describe('resetModal', () => {
    it('should call setDisplayImageModal and setModalData when provided', () => {
      const mockSetDisplayImageModal = jest.fn();
      const mockSetModalData = jest.fn();
      
      const props = {
        setDisplayImageModal: mockSetDisplayImageModal,
        setModalData: mockSetModalData
      };

      imageHelpers.resetModal(props);

      expect(mockSetDisplayImageModal).toHaveBeenCalledWith(false);
      expect(mockSetModalData).toHaveBeenCalledWith({});
    });

    it('should not throw when setDisplayImageModal is not provided', () => {
      const props = {};
      expect(() => imageHelpers.resetModal(props)).not.toThrow();
    });

    it('should call window.gtag when window is defined and gtag exists', () => {
      const mockGtag = jest.fn();
      const originalGtag = window.gtag;
      window.gtag = mockGtag;

      const props = {
        setDisplayImageModal: jest.fn(),
        setModalData: jest.fn()
      };

      imageHelpers.resetModal(props);

      expect(mockGtag).toHaveBeenCalledWith('event', 'image_modal_close');
      
      if (originalGtag) {
        window.gtag = originalGtag;
      } else {
        delete window.gtag;
      }
    });

    it('should not throw when window is undefined', () => {
      const originalWindow = global.window;
      delete global.window;

      const props = {
        setDisplayImageModal: jest.fn(),
        setModalData: jest.fn()
      };

      expect(() => imageHelpers.resetModal(props)).not.toThrow();

      global.window = originalWindow;
    });

    it('should not throw when window.gtag is undefined', () => {
      const originalGtag = window.gtag;
      delete window.gtag;

      const props = {
        setDisplayImageModal: jest.fn(),
        setModalData: jest.fn()
      };

      expect(() => imageHelpers.resetModal(props)).not.toThrow();

      if (originalGtag) {
        window.gtag = originalGtag;
      }
    });
  });

  describe('openModal', () => {
    it('should call setDisplayImageModal and setModalData with correct values', () => {
      const mockSetDisplayImageModal = jest.fn();
      const mockSetModalData = jest.fn();
      const testData = { imageUrl: 'test.jpg' };
      
      const props = {
        setDisplayImageModal: mockSetDisplayImageModal,
        setModalData: mockSetModalData
      };

      imageHelpers.openModal(props, testData);

      expect(mockSetDisplayImageModal).toHaveBeenCalledWith(true);
      expect(mockSetModalData).toHaveBeenCalledWith(testData);
    });

    it('should call window.gtag when window is defined and gtag exists', () => {
      const mockGtag = jest.fn();
      const originalGtag = window.gtag;
      window.gtag = mockGtag;

      const testData = { imageUrl: 'test.jpg' };
      const props = {
        setDisplayImageModal: jest.fn(),
        setModalData: jest.fn()
      };

      imageHelpers.openModal(props, testData);

      expect(mockGtag).toHaveBeenCalledWith('event', 'image_modal_open', testData);
      
      if (originalGtag) {
        window.gtag = originalGtag;
      } else {
        delete window.gtag;
      }
    });

    it('should not throw when window is undefined', () => {
      const originalWindow = global.window;
      delete global.window;

      const testData = { imageUrl: 'test.jpg' };
      const props = {
        setDisplayImageModal: jest.fn(),
        setModalData: jest.fn()
      };

      expect(() => imageHelpers.openModal(props, testData)).not.toThrow();

      global.window = originalWindow;
    });

    it('should not throw when window.gtag is undefined', () => {
      const originalGtag = window.gtag;
      delete window.gtag;

      const testData = { imageUrl: 'test.jpg' };
      const props = {
        setDisplayImageModal: jest.fn(),
        setModalData: jest.fn()
      };

      expect(() => imageHelpers.openModal(props, testData)).not.toThrow();

      if (originalGtag) {
        window.gtag = originalGtag;
      }
    });
  });
});
