################################################################################
# Automatically-generated file. Do not edit!
################################################################################

-include ../makefile.init

RM := rm -rf

# All of the sources participating in the build are defined here
-include sources.mk
-include src/subdir.mk
-include subdir.mk
-include objects.mk

-include ../makefile.defs

# Add inputs and outputs from these tool invocations to the build variables 
NOSTRIP += \
app.nostrip \

# Print environment
$(info $(BIN))
$(info $(DEV_PATH))
$(info $(TOOLCHAIN))

# All Target
all: $(BIN)

# Tool invocations
$(BIN): $(NOSTRIP)
	@echo 'Building target: $@'
	@echo 'Invoking: GCC Strip'
	"$(TOOLCHAIN)/bin/arm-none-linux-gnueabi-strip" -g $(NOSTRIP) -o"$(BIN)"
	@echo 'Finished building target: $@'
	@echo ' '

app.nostrip: $(OBJS) $(USER_OBJS)
	@echo 'Invoking: GCC Linker'
	"$(TOOLCHAIN)/bin/arm-none-linux-gnueabi-gcc" -o"app.nostrip" $(OBJS) $(USER_OBJS) $(LIBS) -L"$(DEV_PATH)/lib" -Wl,-rpath=//opt/lib -Wl,-rpath=./lib -Wl,-rpath-link,"$(DEV_PATH)/lib" -losal -lcrypto -lfreetype -lpng -lpthread -lts -lxui -L"../lib"
	@echo 'Finished building: $@'
	@echo ' '

# Other Targets
clean:
	-$(RM) $(OBJS)$(NOSTRIP) $(BIN)
	-@echo ' '

.PHONY: all clean dependents
.SECONDARY:

-include ../makefile.targets
