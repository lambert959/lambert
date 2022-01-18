/*------------------------------------------------------------
* FileName: main.c
* Author: xlu
* Date: 2016-03-15
------------------------------------------------------------*/
#include "osal.h"
#include "font.h"
#include "header.h"
#include "lcd.h"
#include "keyboard.h"

int Time2Str(ST_TIME* time, char* str)
{
	sprintf(str, "%04d-%02d-%02d %02d:%02d:%02d", time->Year, time->Month, time->Day, time->Hour, time->Minute, time->Second);
	return 0;
}

int Init()
{
	if (OpenFont(FONT_NAME) < 0) {
		return -1;
	}
	if (OpenLcd() < 0) {
		return -1;
	}
	if (OpenKeyboard(KEYBOARD_NAME) < 0) {
		return -1;
	}
	return 0;
}

int Finish()
{
	CloseFont();
	CloseLcd();
	CloseKeyboard();
	return 0;
}

int HelloWorld()
{
	int w, h;
	int titleHeight = 32;
	int timeHeight = 24;
	int strLen;
	char title[] = "Hello, world";
	char strOldTime[sizeof(ST_TIME) + 8];
	char strNewTime[sizeof(ST_TIME) + 8];
	ST_TIME oldTime;
	ST_TIME newTime;
	char flag = 1;
	int key;
	int startx, starty, endy;
	char rotationAngle[64];

	/* get lcd rotation angle */
	int angle;
	OsRegGetValue("ro.fac.lcd.rotate", rotationAngle);
	angle = atoi(rotationAngle);
	setLcdRotation(angle);

	/* get LCD size*/
	GetLcdSize(&w, &h);

	/* set background color */
	DrawLcd(0, 0, w, h >> 2, BLUE);
	DrawLcd(0, h >> 2, w, h, GRAY);

	/* print hello world */
	strLen = GetStringLength(title, titleHeight);
	DrawString(title, titleHeight, (w - strLen) >> 1, titleHeight >> 1, WHITE);

	/* print current time */
	memset(strOldTime, 0, sizeof(strOldTime));
	memset(strNewTime, 0, sizeof(strNewTime));
	OsGetTime(&oldTime);
	Time2Str(&oldTime, strOldTime);
	startx = (w - strLen) >> 1;
	starty = (h - timeHeight) >> 1;
	endy = (h >> 1) + timeHeight;
	DrawString(strOldTime, timeHeight, startx, starty, BLACK);
	StartDrawLcd(0, 0, w, h);
	/* refresh current time until the user press Cancel button */
	while (flag) {
		key = GetKey();
		switch (key) {
		case KEY_CANCEL:
		case KEY_BACK:
			flag = 0;
			break;
		default:
			break;
		}
		OsGetTime(&newTime);
		Time2Str(&newTime, strNewTime);
		if (strcmp(strOldTime, strNewTime) != 0) {
			DrawLcd(0, starty, w, endy, GRAY);
			DrawString(strNewTime, timeHeight, startx, starty, BLACK);
			StartDrawLcd(0, 0, w, endy);
			strcpy(strOldTime, strNewTime);
		}
	}
	return 0;
}

int main()
{
	Init();
	HelloWorld();
	Finish();
	return 0;
}

