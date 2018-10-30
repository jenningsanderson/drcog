import xml.etree.ElementTree as et
import os
import re
import sys


north_regex = re.compile('^(N )')
blvd_regex = re.compile(r'( Blvd)$')
ct_regex = re.compile('( Ct)$')
pl_regex = re.compile('( Pl)$')
st_regex = re.compile('( St)$')


class BuildingNode:
    def __init__(self, building):
        self.id = building.attrib['id']
        self.street = None
        self.city = None
        for tag in building:
            if tag.get('k') == "addr:street":
                self.street = tag.get('v')
            if tag.get('k') == "addr:city":
                self.city = tag.get('v')


def main():
    ways = root.findall("./way")
    for bldg in ways:
        building = BuildingNode(bldg)
        if building.street is None:
            continue
        my_street = change_street_name(building.street, building.city)
        if my_street != str(building.street):  # Checks if the street name needs to be changed
            for tag in bldg:
                if (tag.get('k')) == "addr:street":
                    tag.set('v', my_street)

    tree.write(output, encoding='utf-8', xml_declaration=True)

    try:    # Make sure the file line lengths of source and update files are the same
        assert get_file_length(output) == source_file_length
    except AssertionError as e:
        print("Warning: File length of updated file does not match source file length! \n{}".format(e))
        os.remove(output)


def change_street_name(street_name, city):
    street_name, city = str(street_name), str(city)
    if city == "Denver":
        if north_regex.match(street_name):
            street_name = street_name[2:]
    if blvd_regex.search(street_name):
        street_name = street_name[:-4] + "Boulevard"
    if ct_regex.search(street_name):
        street_name = street_name[:-2] + "Court"
    if pl_regex.search(street_name):
        street_name = street_name[:-2] + "Place"
    if st_regex.search(street_name):
        street_name = street_name[:-2] + "Street"
    return street_name


def get_file_length(fname):
    with open(fname) as f:
        for i, l in enumerate(f):
            pass
        return i + 1


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("This script needs an input file path as the argument")
        exit()
    osm_source = sys.argv[1]
    if len(sys.argv) == 3:
        output = sys.argv[2]
    else:
        output = str(osm_source).split('.')
        output.insert(-1, 'update.')
        output = ''.join(output)
    tree = et.parse(osm_source)
    root = tree.getroot()
    source_file_length = get_file_length(osm_source)
    main()
