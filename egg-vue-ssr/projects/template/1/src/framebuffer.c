/*------------------------------------------------------------
* FileName: framebuffer.c
* Author: xlu
* Date: 2016-03-15
------------------------------------------------------------*/
#include "framebuffer.h"
#include "header.h"


/**
 * mapped FrameBuffer device memory
 */
static void *gFb = NULL;
static void *gFbCache = NULL;
/**
 * screen information
 * see fb_var_screeninfo structure:
 * xres means point number in row
 * yres means point number in column
 * bits_per_pixels means bit number of each point
 */
static struct fb_var_screeninfo gFbVarInfo;

/**
 * Open FrameBuffer.
 * [in] deviceName device name for frame buffer.
 * return FrameBuffer handler
 */
int OpenFrameBuffer(const char *deviceName)
{
	int fd;
	unsigned int screenSize;

	/* open the FrameBuffer device. */
	fd = open(deviceName, O_RDWR);
	if (fd < 0)
	{
		return -1;
	}

	/* get the variable screen info */
	if (ioctl(fd, FBIOGET_VSCREENINFO, &gFbVarInfo) < 0)
	{
		return -1;
	}
	screenSize = (gFbVarInfo.xres * gFbVarInfo.yres * gFbVarInfo.bits_per_pixel) >> 3;
	gFb = mmap(0, screenSize, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
	gFbCache = malloc(screenSize);
	if (gFb == MAP_FAILED)
	{
		return -1;
	}
	return fd;
}

/**
 * Close FrameBuffer.
 * [in] fd FrameBuffer handler
 * return 0 if successful, else return -1
 */
int CloseFrameBuffer(int fd)
{
	int ret = munmap(gFb, (gFbVarInfo.xres * gFbVarInfo.yres * gFbVarInfo.bits_per_pixel) >> 3);
	close(fd);
	free(gFbCache);
	return ret;
}

/**
 * Get frame buffer size (width and height).
 * [out] w width
 * [out] h height
 * return 0 if successful, else return -1
 */
int GetFrameBufferSize(int *w, int *h)
{
	if (gFbVarInfo.xres <= 0 || gFbVarInfo.yres <= 0) {
		return -1;
	}
	*w = gFbVarInfo.xres;
	*h = gFbVarInfo.yres;
	return 0;
}

/**
 * Draw a rectangle.
 * [in] x0 starting x coordinate, range [0, xres - 1]
 * [in] y0 starting y coordinate, range [0, yres - 1]
 * [in] x1 ending x coordinate, range [x0, xres - 1]
 * [in] y1 ending y coordinate, range [y0, yres - 1]
 * [in] color color to fill
 * return 0 if successful
 */
int DrawFrameBuffer(int x0, int y0, int x1, int y1, COLOR32 color)
{
	int i, j, offset;
	COLOR32* p32 = (COLOR32*)gFbCache;
	COLOR16* p16 = (COLOR16*)gFbCache;
	COLOR16 color16;

	int minx = MIN(x0, x1);
	int maxx = MAX(x0, x1);
	int miny = MIN(y0, y1);
	int maxy = MAX(y0, y1);

	if (gFbVarInfo.bits_per_pixel == 32)
	{
		for (j = miny; j < maxy; ++j)
		{
			offset = j * gFbVarInfo.xres;
			for (i = minx; i < maxx; ++i)
			{
				*(p32 + (offset + i)) = color;
			}
		}
	}
	else
	{
		color16 = COLOR_32_TO_16(color);
		for (j = miny; j < maxy; ++j)
		{
			offset = j * gFbVarInfo.xres;
			for (i = minx; i < maxx; ++i)
			{
				*(p16 + (offset + i)) = color16;
			}
		}
	}
	return 0;
}

/**
 * Start drawing a rectangle.
 * x coordinate is from bottom to top, and y coordinate is from left to right
 * [in] x0 starting x coordinate, range [0, xres]
 * [in] y0 starting y coordinate, range [0, yres]
 * [in] x1 ending x coordinate, range [x0, xres]
 * [in] y1 ending y coordinate, range [y0, yres]
 * return 0 if successful
 */
int StartDrawFrameBuffer(int x0, int y0, int x1, int y1)
{
	int j;
	int pos;

	int minx = MIN(x0, x1);
	int maxx = MAX(x0, x1);
	int len = maxx - minx;
	int miny = MIN(y0, y1);
	int maxy = MAX(y0, y1);
	int bytesPerPixel = gFbVarInfo.bits_per_pixel >> 3;

	for (j = miny; j < maxy; ++j)
	{
		pos = (j * gFbVarInfo.xres + minx) * bytesPerPixel;
		memcpy((char*)gFb + pos, (char*)gFbCache + pos, len * bytesPerPixel);
	}
	return 0;
}

/**
 * FrameBuffer test case.
 * return 0 if successful
 */
int TestFrameBuffer()
{
	int fd;
	fd = OpenFrameBuffer(LCD_NAME);
	if (fd < 0)
	{
		return -1;
	}
	DrawFrameBuffer(0, 0, gFbVarInfo.xres, 0, RED);
	DrawFrameBuffer(0, 0, 0, gFbVarInfo.yres, RED);
	DrawFrameBuffer(gFbVarInfo.xres, 0, gFbVarInfo.xres, gFbVarInfo.yres, RED);
	DrawFrameBuffer(0, gFbVarInfo.yres, gFbVarInfo.xres, gFbVarInfo.yres, RED);
	DrawFrameBuffer(gFbVarInfo.xres >> 2, gFbVarInfo.yres >> 2, (gFbVarInfo.xres * 3) >> 2, (gFbVarInfo.yres * 3) >> 2, RED);
	StartDrawFrameBuffer(0, 0, gFbVarInfo.xres, gFbVarInfo.yres);
	CloseFrameBuffer(fd);
	return 0;
}
