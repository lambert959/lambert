/*------------------------------------------------------------
* FileName: lcd.c
* Author: xlu
* Date: 2016-03-15
------------------------------------------------------------*/
#include "framebuffer.h"
#include "header.h"
#include "lcd.h"
#include "osal.h"

/* FrameBuffer handler */
static int gFd;

/* LCD rotation angle, can be 0, 90, 180, 270, ... */
static int gAngle = 0;

/**
 * Open LCD.
 * return 0 if successful, else return -1
 */
int OpenLcd()
{
	gFd = OpenFrameBuffer(LCD_NAME);
	if (gFd < 0)
	{
		printf("Open framebuffer device failed!\n");
		return -1;
	}
	return 0;
}

/**
 * Close LCD.
 * return 0 if successful, else return -1
 */
int CloseLcd()
{
	return CloseFrameBuffer(gFd);
}

/**
 * Draw LCD rectangle.
 * [in] x0 starting x coordinate, range [0, w]
 * [in] y0 starting y coordinate, range [0, h]
 * [in] x1 ending x coordinate, range [x0, w]
 * [in] y1 ending y coordinate, range [y0, h]
 * [in] color color to fill
 * return 0 if successful
 */
int DrawLcd(int x0, int y0, int x1, int y1, COLOR32 color)
{
	int _x0, _y0, _x1, _y1;
	Lcd2Fb(x0, y0, &_x0, &_y0);
	Lcd2Fb(x1, y1, &_x1, &_y1);
	return DrawFrameBuffer(_x0, _y0, _x1, _y1, color);
}

/**
 * Start draw LCD rectangle.
 * [in] x0 starting x coordinate, range [0, w]
 * [in] y0 starting y coordinate, range [0, h]
 * [in] x1 ending x coordinate, range [x0, w]
 * [in] y1 ending y coordinate, range [y0, h]
 * return 0 if successful
 */
int StartDrawLcd(int x0, int y0, int x1, int y1)
{
	int _x0, _y0, _x1, _y1;
	Lcd2Fb(x0, y0, &_x0, &_y0);
	Lcd2Fb(x1, y1, &_x1, &_y1);
	StartDrawFrameBuffer(_x0, _y0, _x1, _y1);
	return 0;
}

/**
 * Draw a point.
 * [in] x x coordinate, range [0, xres]
 * [in] y y coordinate, range [0, yres]
 * [in] color color to fill
 * return 0 if successful
 */
int DrawPoint(int x, int y, COLOR32 color)
{
	int ret;
	int x0, y0;
	Lcd2Fb(x, y, &x0, &y0);
	ret = DrawFrameBuffer(x0, y0, x0 + 1, y0 + 1, color);
	if (ret != 0) {
		return -1;
	}
	return StartDrawFrameBuffer(x0, y0, x0 + 1, y0 + 1);
}

/**
 * Get LCD size.
 * Call "OpenLcd" first before use this function
 * [out] w LCD width
 * [out] h LCD height
 * return 0 if successful
 */
int GetLcdSize(int* w, int* h)
{
	int ret;
	int fbw, fbh;
	ret = GetFrameBufferSize(&fbw, &fbh);
	if (ret != 0) {
		return -1;
	}

	if (gAngle % 180 == 0) {
		*w = fbw;
		*h = fbh;
	} else {
		*w = fbh;
		*h = fbw;
	}
	return 0;
}

/**
 * Set LCD rotation angle.
 * [in] angle the rotation, can be 0, 90, 180, 270, ...
 */
void setLcdRotation(int angle)
{
	gAngle = (angle / 90) * 90;
}

/**
 * Change LCD coordinate to frame buffer coordinate.
 * [in] x x coordinate in LCD
 * [in] y y coordinate in LCD
 * [out] _x x coordinate in frame buffer
 * [out] _y y coordinate in frame buffer
 */
void Lcd2Fb(int x, int y, int *_x, int *_y)
{
	int w, h;
	GetLcdSize(&w, &h);

	int angle = gAngle % 360;
	switch (angle) {
	case 0:
		*_x = x;
		*_y = y;
		break;
	case 90:
		*_x = h - y;
		*_y = x;
		break;
	case 180:
		*_x = w - x;
		*_y = h - y;
		break;
	case 270:
		*_x = y;
		*_y = w - x;
		break;
	}
}

/**
 * LCD test case.
 * return 0 if successful
 */
int TestLcd()
{
	int ret;
	int w, h;

	ret = OpenLcd();
	if (ret < 0)
	{
		printf("open LCD failed!\n");
		return -1;
	}
	setLcdRotation(0);
	GetLcdSize(&w, &h);
	DrawLcd(0, 0, w, 0, RED);	// Top left to right
	DrawLcd(0, 0, 0, h, RED);	// left top to bottom
	DrawLcd(w, 0, w, h, RED);	// right top to bottom
	DrawLcd(0, h, w, h, RED);	// bottom left to right
	DrawLcd(w >> 2, h >> 2, (w * 3) >> 2, (h * 3) >> 2, RED);
	StartDrawLcd(0, 0, w, h);

	CloseLcd();
	return 0;
}
