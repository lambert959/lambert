################################################################################
# Automatically-generated file. Do not edit!
################################################################################

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS += \
../src/font.c \
../src/framebuffer.c \
../src/keyboard.c \
../src/lcd.c \
../src/main.c 

OBJS += \
./src/font.o \
./src/framebuffer.o \
./src/keyboard.o \
./src/lcd.o \
./src/main.o 


# Each subdirectory must supply rules for building sources it contributes
src/%.o: ../src/%.c
	@echo 'Building file: $<'
	@echo 'Invoking: GCC Compiler'
	"$(TOOLCHAIN)/bin/arm-none-linux-gnueabi-gcc" -O0 -g2 -Wall -funwind-tables -I"../inc" -I"../src" -I"$(DEV_PATH)/include" -I"$(DEV_PATH)/include/freetype2" -I"$(TOOLCHAIN)/arm-none-linux-gnueabi/libc/usr/include" -I"$(TOOLCHAIN)/lib/gcc/arm-none-linux-gnueabi/$(GNU_VERSION)/include" -c -o "$@" "$<"
	@echo 'Finished building: $<'
	@echo ' '


