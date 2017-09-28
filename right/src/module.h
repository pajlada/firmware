#ifndef __MODULE_H__
#define __MODULE_H__

// Includes:

    #include "layer.h"
    #include "slot.h"

// Macros:

    #define MODULE_REQUEST_GET_PROTOCOL_VERSION 0
    #define MODULE_REQUEST_GET_MODULE_ID        1
    #define MODULE_REQUEST_GET_MODULE_NAME      2
    #define MODULE_REQUEST_GET_FEATURES         3
    #define MODULE_REQUEST_GET_FACTORY_LAYER    4
    #define MODULE_REQUEST_GET_POINTER_INFO     5
    #define MODULE_REQUEST_GET_STATE            6
    #define MODULE_REQUEST_GET_GRAPHICS         7

    #define MODULE_STATUS_ATTACHED MODULE_REQUEST_GET_STATE

    #define POINTER_ROLE_MOVE   0
    #define POINTER_ROLE_SCROLL 1

    #define MAX_MODULE_NAME_LENGTH       64
    #define MAX_KEY_COUNT_PER_MODULE     64
    #define MAX_POINTER_COUNT_PER_MODULE 2

// Typedefs:

    typedef enum {
        ModuleId_LeftKeyboardHalf = 1,
        ModuleId_KeyClusterLeft   = 2,
        ModuleId_TrackballRight   = 3,
        ModuleId_TrackpointRight  = 4,
        ModuleId_TouchpadRight    = 5,
    } module_id_t;

    typedef struct {
        uint8_t acceleration;
        uint8_t maxSpeed;
        uint8_t roles[LAYER_COUNT];
    } pointer_t;

    typedef struct {
        uint8_t enumerationState;
        uint8_t enumerationSubstate;
        uint8_t moduleId;
        char moduleName[MAX_MODULE_NAME_LENGTH];
        uint8_t pointerCount;
        uint8_t keyCount;
        uint8_t keyStates[MAX_KEY_COUNT_PER_MODULE];
        uint8_t pointerRole;
    } module_t;

// Variables:

    extern module_t AttachedModules[SLOT_COUNT];

#endif
