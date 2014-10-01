#!/bin/bash
# by VellBibi
# init your app info
app_name="vview"
app_dir="/home/boooo/git/Moreii-express/node-webkit/"

win_nw_zipfile="/home/boooo/soft/node-webkit-v0.10.5-win-ia32.zip"
linux_nw_tarfile="/home/boooo/soft/node-webkit-v0.10.2-linux-x64.tar.gz"
mac_nw_zipfile="/home/boooo/soft/node-webkit-v0.10.5-osx-x64.zip"

# read pack_flag
w=false && l=false && m=false && o=false
while getopts "wlmo" arg # -w:windows -l:linux -m:mac -o:overwrite
do
	case $arg in
             w)
                w=true
                ;;
             l)
                l=true
                ;;
             m)
                m=true
                ;;
			 o)
				o=true
				;;
             ?)
            echo "unkonw argument"
        exit 1
        ;;
    esac
done

if [ ${o} = true ]; then
	#remove old file
	[ ${w} = true ] && rm -rf ${app_name}_win
	[ ${l} = true ] && rm -rf ${app_name}_linux
	[ ${m} = true ] && rm -rf ${app_name}_mac
fi

# create app.nw file
cd $app_dir
zip app.nw ./*
app_nwfile=${app_dir}/app.nw

if [ ${w} = true ]; then
	echo "creating windows *.exe file..."
	unzip $win_nw_zipfile -d ${app_name}_win && cd ${app_name}_win
	cat nw.exe $app_nwfile > ${app_name}.exe
	rm -rf nw.exe nwsnapshot.exe credits.html
	cd ..
	echo "create windows app success!"
else
	echo "ignore windows app"
fi

if [ ${l} = true ]; then
	echo "creating linux execute file..."
	tar -xvf $linux_nw_tarfile -C ./
	tardir=${linux_nw_tarfile%.tar*} && tardir=${tardir##*/} # rename tardir
	mv  $tardir ${app_name}_linux && cd ${app_name}_linux
	cat nw $app_nwfile > ${app_name} && chmod +x ${app_name}
	rm -rf nw nwsnapshot credits.html
	cd ..
	echo "create linux app success!"
else
	echo "ignore linux app"
fi

if [ ${m} = true ]; then
	echo "creating mac execute file..."
	unzip $mac_nw_zipfile -d ${app_name}_mac && cd ${app_name}_mac
	if [ -f ${app_dir}/Info.plist ];then
    		cp ${app_dir}/Info.plist node-webkit.app/Contents/
	fi
	cp $app_nwfile node-webkit.app/Contents/Resources/
	if [ -f ${app_dir}/app.icns ];then
    		cp ${app_dir}/app.icns node-webkit.app/Contents/Resources/
	fi
	mv node-webkit.app ${app_name}.app
	rm -rf nwsnapshot credits.html
	cd ..
	echo "create mac app success!"
else
	echo "ignore mac app"
fi

# remove app.nw
rm -f app.nw