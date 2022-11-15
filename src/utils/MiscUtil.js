import MiscUtilCore from "_core/utils/MiscUtil";
import appConfig from "constants/appConfig";

export default class MiscUtil extends MiscUtilCore {
    static enterFullScreen() {
        let element = appConfig.RENDER_NODE || document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    static exitFullscreen() {
        if (MiscUtilCore.getIsInFullScreenMode()) {
            return MiscUtilCore.exitFullscreen();
        }
        return true;
    }
}
