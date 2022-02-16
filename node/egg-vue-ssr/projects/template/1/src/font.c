/*------------------------------------------------------------
* FileName: font.c
* Author: xlu
* Date: 2016-03-15
------------------------------------------------------------*/
#include "font.h"
#include "framebuffer.h"
#include "lcd.h"
#include "osal.h"

/* distance between 2 neighboring characters */
#define CHARACTER_DISTANCE  2

/* font handler */
static int gFont;

/**
 * Open font.
 * [in] filename font file name, such as "paxfont.ttf"
 * return font handle(>=0)
 */
int OpenFont(const char *filename)
{
	gFont = OsOpenFont(filename);
	if (gFont < 0)
	{
		return -1;
	}
	/* better to wait 3 seconds to let the system loads dot matrix before calling OsGetFontDot function */
	/* sleep(3); */
	return gFont;
}

/**
 * Close font.
 */
void CloseFont()
{
	OsCloseFont(gFont);
}

/**
 * Get dots of a string.
 * [in] str the string to display
 * [out] ftDots dots of the string
 * [in] height initialized height of the string
 */
int GetStringDots(const char *str, FT_DOT ftDots[], int height)
{
	int i;
	int ret;
	char character[2];
	int len = strlen(str);
	/* the with is better set as half length of the height */
	int width = height >> 1;
	/* the last byte must be \0 */
	character[1] = '\0';
	for (i = 0; i < len; ++i)
	{
		character[0] = *(str + i);
		/* load the dot matrix of the character. */
		/* if using FONT_STYLE_BOLD, the inner algorithm is very complicate and takes for a long time */
		ret = OsGetFontDot(gFont, character, width, height, FONT_STYLE_NONE, &ftDots[i]);
		if (ret != RET_OK)
		{
			return -1;
		}
	}
	return 0;
}

/**
 * Get displaying length of a string.
 * If you want to shown a string in the center horizontally of the LCD,
 * just set starting x position: (screen_width - GetStringLength()) / 2
 * [in] ftDots dots array of the string
 * [in] ftDotsNum element number of dots array
 * [in] height initialized height of the string
 * return displaying length if successful, else return -1
 */
int GetStringLength(const char* str, int height)
{
	int i;
	int widthSum = 0;
	int len = strlen(str);
	/* the with is better set as half length of the height */
	int width = height >> 1;
	FT_DOT ftDots[len];
	if (GetStringDots(str, ftDots, height) < 0)
	{
		return -1;
	}
	for (i = 0; i < len; ++i)
	{
		/* width of blank space " " is 0 */
		widthSum += (ftDots[i].Width == 0)?width:ftDots[i].Width;
	}
	widthSum += (CHARACTER_DISTANCE * len);
	return widthSum;
}

/**
 * Draw font dot.
 * [in] pFtDot pointer to the FT_DOT
 * [in] x starting x coordinate
 * [in] y starting y coordinate
 * [in] color color to draw
 * return 0 if successful
 */
int DrawFontDot(const FT_DOT *pFtDot, int x, int y, COLOR32 color)
{
	int i, j, k;
	unsigned char dot;
	/* byte number of every line, must align to an integer multiple of 8 */
	int lineLen = (pFtDot->Width + 7) >> 3;
	int x0, y0, x1, y1;
	x0 = x;
	y0 = y;
	x1 = x0;
	y1 = y0;

	for (i = 0; i < pFtDot->Height; ++i)
	{
		int start = i * lineLen;
		for (j = 0; j < lineLen; ++j)
		{
			/* current dot */
			dot = pFtDot->Dot[start + j];
			/* get every bit */
			for (k = 7; k >= 0; --k)
			{
				/* if the bit value is 1, set color */
				if ((dot >> k) & 0x1)
				{
					DrawPoint(x1, y1, color);
				}/* else {
					DrawPoint(x1, y1, RED);
				}*/
				/* set x position of next bit */
				++x1;
			}
		}
		/* set the starting position of the next line */
		x1 = x0;
		++y1;
	}
	return 0;
}

/**
 * Draw string.
 * [in] str string to draw
 * [in] height initialized height
 * [in] x starting x coordinate
 * [in] y starting y coordinate
 * [in] color color to draw
 * return 0 if successful, else return -1
 */
int DrawString(const char *str, int height, int x, int y, COLOR32 color)
{
	int i;
	/* the with is better set as half length of the height */
	int width = height >> 1;
	int size = strlen(str);
	FT_DOT ftDots[size];
	/* get dots according to the string */
	GetStringDots(str, ftDots, height);
	for (i = 0; i < size; ++i)
	{
		DrawFontDot(&ftDots[i], x, y + (height - ftDots[i].Top), color);
		/* if use the following, then the characters will bottom align
		DrawFontDot(&ftDots[i], x, y + (height - ftDots[i].Height), color);
		*/
		x += (ftDots[i].Width == 0)?width:ftDots[i].Width;
		x += CHARACTER_DISTANCE;
	}
	return 0;
}


/**
 * Font test case.
 * return 0 if successful, else return -1
 */
int TestFont()
{
	int w, h;
	int height = 24;
	const char *str1 = "Top Left";
	const char *str2 = "Middle";
	int strLen;
	/* open font */
	gFont = OpenFont(FONT_NAME);
	if (gFont < 0)
	{
		return -1;
	}
	/* draw the characters */
	DrawString(str1, height, 0, 0, RED);
	/* get displaying length of a string */
	strLen = GetStringLength(str2, height);
	/* get screen size */
	GetLcdSize(&w, &h);
	DrawString(str2, height, (w - strLen) >> 1, (h - height) >> 1, RED);
	StartDrawLcd(0, 0, w, h);
	/* close font */
	CloseFont();
	return 0;
}
