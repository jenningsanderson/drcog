from change_street_names import change_street_name as csn
import unittest


class TestStreetChange(unittest.TestCase):

    def test_north_street_cases(self):
        self.assertEqual(csn('N Galapago St', 'Denver'), "Galapago Street")
        self.assertEqual(csn('North Galapago St', 'Denver'), "North Galapago Street")
        self.assertEqual(csn('S Galapago St', 'Denver'), "S Galapago Street")
        self.assertEqual(csn('Galapago St North', 'Denver'), "Galapago St North")
        self.assertEqual(csn('N Galapago St', 'Aurora'), "N Galapago Street")
        self.assertEqual(csn('Galapago N Blvd', 'Denver'), "Galapago N Boulevard")

    def test_street_abbrev(self):
        self.assertEqual(csn('Blvd Galapago N', 'Denver'), "Blvd Galapago N")
        self.assertEqual(csn('N Galapago Way', 'Denver'), "Galapago Way")
        self.assertEqual(csn('E Galapago Blvd St', 'Denver'), "E Galapago Blvd Street")
        self.assertEqual(csn('Blvd Galapago Pl', 'Aurora'), "Blvd Galapago Place")
        self.assertEqual(csn('N Galapago Ave', 'Commerce City'), "N Galapago Ave")
        self.assertEqual(csn('N Galapago Ct Ct', 'Denver'), "Galapago Ct Court")
        self.assertEqual(csn('Blvd Galapago N', 'St'), "Blvd Galapago N")
        self.assertEqual(csn('E Galapago Place', 'Denver'), "E Galapago Place")
        self.assertEqual(csn('W First', 'Denver'), "W First")
        self.assertEqual(csn('N First', 'Denver'), "First")
        self.assertEqual(csn('W FirSt', 'Denver'), "W FirSt")
        self.assertEqual(csn('W FirSt St', 'Denver'), "W FirSt Street")
        self.assertEqual(csn('', ''), "")



if __name__ == '__main__':
    unittest.main()
